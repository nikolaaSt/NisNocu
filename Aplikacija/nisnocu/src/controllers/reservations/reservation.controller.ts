import { Body, Controller, Delete, Get, Param, Put,Post } from "@nestjs/common";
import { AddReservationDto } from "dto/reservations/add.reservation.dto";
import { Reservations } from "src/entities/reservations.entity";
import { ApiResponse } from "src/misc/api.response";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { qrcodeService } from "src/services/qrcode/qrcode.services";
import { ReservationsService } from "src/services/reservations/reservations.services";

@Controller('api/reservations')
export class reservationController{
    constructor(private readonly reservationService:ReservationsService,
                private readonly administratorService:AdministratorService,
                private readonly qrcodeService:qrcodeService){}

    @Get()
    getAll():Promise<Reservations[]>{
        return this.reservationService.getAll();
    }

    @Get(':id')
    getById(@Param('id') ReservationsId:number):Promise<Reservations|ApiResponse>{
        return this.reservationService.getById(ReservationsId);
    }
    @Get('event')
    getByEvent(@Param('eventId') eventId:number):Promise<Reservations[]>{
        return this.reservationService.getByEvent(eventId);
    }
    @Get('user/:userId')
    getByUser(@Param('userId') userId:number):Promise<Reservations[]>{
        return this.reservationService.getByUser(userId);
    }

    @Put('add/:userId/:eventId')
    addReservation(@Param('userId') userId:number,@Param('eventId') eventId:number, @Body() data:AddReservationDto):Promise<Reservations|ApiResponse>{
        return this.reservationService.addReservation(userId, eventId,data);
    }

    @Delete(':id')
  async  removeEvent(@Param('id') ReservationsId:number){
        await this.qrcodeService.deleteQr(ReservationsId);
        return this.reservationService.deleteReservation(ReservationsId);
    }
    @Delete('event/:id')
    removebyEvent(@Param('id') EventId:number){
        return this.reservationService.deleteByEvent(EventId);
    }
}
