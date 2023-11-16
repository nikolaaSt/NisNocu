import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lounges } from "./lounges.entity";
import { User } from "./user.entity";
import { Events } from "./events.entity";
import { Tables } from "./tables.entity";
import { qrcode } from "./qrcode.entity";

@Index("fk_reservations_user_id", ["userId"], {})
@Index("fk_reservations_event_id", ["eventId"], {})
@Entity("reservations", { schema: "nisnocu" })
export class Reservations {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "reservation_id",
    unsigned: true,
  })
  reservationId: number;

  @Column("int", { name: "event_id", unsigned: true })
  eventId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

  @Column("text", {
    name: "type",
  })
  type: string;

  @OneToMany(() => Lounges, (lounges) => lounges.reservation)
  lounges: Lounges[];

  @ManyToOne(
    () => User,
    (user) => user.reservations,
    { onDelete: "RESTRICT", onUpdate: "CASCADE" }
  )
  @JoinColumn([
    { name: "user_id", referencedColumnName: "userId" },
  ])
  user: User;

  @ManyToOne(() => Events, (events) => events.reservations, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })

  @JoinColumn([{ name: "event_id", referencedColumnName: "eventId" }])
  event: Events;

  @OneToMany(() => qrcode, (qrcode) => qrcode.reservation)
  qrcode: qrcode[];

  @OneToMany(() => Tables, (tables) => tables.reservation)
  tables: Tables[];
}
