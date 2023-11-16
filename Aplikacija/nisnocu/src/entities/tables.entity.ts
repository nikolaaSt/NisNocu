import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Reservations } from "./reservations.entity";

@Index("fk_tables_reservation_id", ["reservationId"], {})
@Entity("tables")
export class Tables {
  @PrimaryGeneratedColumn({ type: "int", name: "table_id", unsigned: true })
  tableId: number;

  @Column("int", { name: "reservation_id", unsigned: true })
  reservationId: number;

  @ManyToOne(() => Reservations, (reservations) => reservations.tables, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "reservation_id", referencedColumnName: "reservationId" },
  ])
  reservation: Reservations;
}
