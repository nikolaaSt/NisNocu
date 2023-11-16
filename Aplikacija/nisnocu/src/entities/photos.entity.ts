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

@Index("fk_photos_administrator_id", ["administratorId"], {})
@Index("uq_photos_image_path", ["imagePath"], { unique: true })
@Entity("photos", { schema: "nisnocu" })
export class Photos {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "administrator_id", unsigned: true })
  administratorId: number;

  @Column("varchar", {
    name: "image_path",
    unique: true,
    length: 128,
    default: () => "'0'",
  })
  imagePath: string;

  @ManyToOne(() => Administrator, (administrator) => administrator.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "administrator_id", referencedColumnName: "administratorId" },
  ])
  administrator: Administrator;
}
