import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Administrator } from "./administrator.entity";
import { Reservations } from "./reservations.entity";

@Index("fk_events_administrator_id", ["administratorId"], {})
@Entity("events", { schema: "nisnocu" })
export class Events {
  @PrimaryGeneratedColumn({ type: "int", name: "event_id", unsigned: true })
  eventId: number;

  @Column("int", { name: "administrator_id", unsigned: true })
  administratorId: number;

  @Column("text", { name: "description" })
  description: string;

  @Column("date", { name: "starts_at_date" })
  startsAtDate: string;

  @Column("date", { name: "finishes_at_date" })
  finishesAtDate: string;

  @Column("time", { name: "starts_at_time" })
  startsAtTime: string;

  @Column("time", { name: "finishes_at_time" })
  finishesAtTime: string;

  @Column("int", { name: "max_tables", unsigned: true })
  maxTables: number;

  @Column("int", { name: "max_lounges", unsigned: true })
  maxLounges: number;

  @Column("enum", {
    name: "availability",
    enum: ["Available", "Not available"],
    default: () => "'Available'",
  })
  availability: "Available" | "Not available";

  @ManyToOne(() => Administrator, (administrator) => administrator.events, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "administrator_id", referencedColumnName: "administratorId" },
  ])
  administrator: Administrator;

  @OneToMany(() => Reservations, (reservations) => reservations.event)
  reservations: Reservations[];
}
