import { Injectable, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddReservationDto } from 'dto/reservations/add.reservation.dto';
import { Events } from 'src/entities/events.entity';
import { Reservations } from 'src/entities/reservations.entity';
import { User } from 'src/entities/user.entity';
import { ApiResponse } from 'src/misc/api.response';
import { Repository } from 'typeorm';
@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservations)
    private readonly reservations: Repository<Reservations>,
    @InjectRepository(Events)
    private readonly events: Repository<Events>,
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  getAll(): Promise<Reservations[]> {
    return this.reservations.find();
  }

  getByEvent(id: number): Promise<Reservations[]> {
    return this.reservations.find({ where: { eventId: id } });
  }

  getById(id: number): Promise<Reservations> {
    return this.reservations.findOne({ where: { reservationId: id } });
  }

  getByUser(id: number): Promise<Reservations[]> {
    return this.reservations.find({ where: { userId: id } });
  }

  async addReservation(
    userId: number,
    eventId: number,
    data: AddReservationDto,
  ): Promise<Reservations | ApiResponse> {
    const user = await this.user.findOne({ where: { userId: userId } });
    const event = await this.events.findOne({ where: { eventId: eventId } });
    const reservation = await this.reservations.findOne({
      where: { userId: userId, eventId: eventId },
    });
    console.log(reservation);
    if (reservation) {
      return new ApiResponse(
        'error',
        -6968,
        'already added reservation for this event',
      );
    }
    console.log(event);
    const newReservation: Reservations = new Reservations();
    newReservation.eventId = event.eventId;
    newReservation.type = data.type;
    newReservation.userId = user.userId;
    console.log(event.maxLounges);
    console.log(event.maxTables);
    console.log(newReservation.type);
    // console.log(event.maxLounges>0 && newReservation.type==='Lounge')
    // console.log(event.maxTables>0 && newReservation.type==='Table')
    // console.log(event.maxLounges>0 && event.maxTables>0 && (newReservation.type==='Lounge'|| newReservation.type==='Table'))
    if (
      (event.maxLounges > 0 && newReservation.type === 'Lounge') ||
      (event.maxTables > 0 && newReservation.type === 'Table') ||
      (event.maxLounges > 0 &&
        event.maxTables > 0 &&
        (newReservation.type === 'Lounge' || newReservation.type === 'Table'))
    ) {
      try {
        const savedReservation = this.reservations.save(newReservation);
        if (!savedReservation) {
          throw new Error('error');
        }
        if (newReservation.type === 'Table') {
          event.maxTables--;
          this.events.save(event);
          console.log(event.maxTables);

          return savedReservation;
        }
        event.maxLounges = event.maxLounges - 1;
        this.events.save(event);
        return savedReservation;
      } catch (e) {
        return new ApiResponse(
          'error',
          -6969,
          'failed adding reservation or there is no more space for the event',
        );
      }
    } else {
      return new ApiResponse('error', 69969, 'nema mesta');
    }
  }

  async deleteReservation(id: number) {
    let pendingDelete: Reservations = await this.reservations.findOne({
      where: { reservationId: id },
    });
    const eventInc = await this.events.findOne({
      where: { eventId: pendingDelete.eventId },
    });
    if (pendingDelete.type === 'lounge') {
      eventInc.maxLounges++;
      this.events.save(eventInc);
      this.reservations.delete(pendingDelete);
    }
    eventInc.maxTables++;
    this.events.save(eventInc);
    this.reservations.delete(pendingDelete);
  }

  async deleteByEvent(eventId: number) {
    let pendingDelete: Reservations[] = await this.reservations.find({
      where: { eventId: eventId },
    });
    for (let i = 0; i < pendingDelete.length; i++) {
      await this.reservations.delete(pendingDelete[i]);
      console.log(pendingDelete[i]);
    }

    return;
  }
}
