import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservations } from "./reservations.entity";

@Index("fk_lounges_reservation_id", ["reservationId"], {})
@Entity("lounges", { schema: "nisnocu" })
export class Lounges {
  @PrimaryGeneratedColumn({ type: "int", name: "lounge_id", unsigned: true })
  loungeId: number;

  @Column("int", {
    name: "reservation_id",
    unsigned: true,
    default: () => "'0'",
  })
  reservationId: number;

  @ManyToOne(() => Reservations, (reservations) => reservations.lounges, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "reservation_id", referencedColumnName: "reservationId" },
  ])
  reservation: Reservations;
}
