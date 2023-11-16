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
  
  @Index("fk_logos_administrator_id", ["administratorId"], {})
  @Index("uq_logos_logo_path", ["logoPath"], { unique: true })
  @Entity("logos", { schema: "nisnocu" })
  export class Logos {
    @PrimaryGeneratedColumn({ type: "int", name: "logo_id", unsigned: true })
    logoId: number;
  
    @Column("int", { name: "administrator_id", unsigned: true })
    administratorId: number;
  
    @Column("varchar", {
      name: "logo_path",
      unique: true,
      length: 128,
      default: () => "'0'",
    })
    logoPath: string;
  
    @ManyToOne(() => Administrator, (administrator) => administrator.logos, {
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    })
    @JoinColumn([
      { name: "administrator_id", referencedColumnName: "administratorId" },
    ])
    administrator: Administrator;
  }
  