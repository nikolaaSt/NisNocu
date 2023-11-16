import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Administrator } from "./administrator.entity";
  import { User } from "./user.entity";
import { Reservations } from "./reservations.entity";
  
  @Index("fk_qrcode_reservation_id", ["reservationId"], {})
  @Index("uq_qrcode_qr_path", ["qrPath"], { unique: true })
  @Entity("qrcode", { schema: "nisnocu" })
  export class qrcode {
    @PrimaryGeneratedColumn({ type: "int", name: "qrcode_id", unsigned: true })
    qrcodeId: number;
  
    @Column("int", { name: "reservation_id", unsigned: true })
    reservationId: number;
  
    @Column("varchar", {
      name: "qr_path",
      unique: true,
      length: 128,
      default: () => "'0'",
    })
   qrPath: string;
  
    @ManyToOne(() => Reservations, (reservations) => reservations.qrcode, {
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    })
    
    @JoinColumn([
      { name: "reservation_id", referencedColumnName: "reservationId" },
    ])
    reservation: Reservations;
  }
  