import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Events } from "./events.entity";
import { Photos } from "./photos.entity";
import { AdministratorToken } from "./administratortoken.entity";
import { Ratings } from "./ratings.entity";
import { Logos } from "./logo.entity";
import * as Validator from 'class-validator';

@Index("uq_administrator_phone_number", ["phoneNumber"], { unique: true })
@Index("uq_administrator_username", ["username"], { unique: true })
@Entity("administrator", { schema: "nisnocu" })
export class Administrator {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "administrator_id",
    unsigned: true,
  })
  administratorId: number;

  @Column("varchar", { name: "username", unique: true, length: 32 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  username: string;

  @Column("varchar", { name: "password_hash", length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  @Validator.Length(6,30)
  
  passwordHash: string;

  @Column("varchar", { name: "phone_number", unique: true, length: 24 })
  phoneNumber: string;

  @Column("varchar", { name: "address", length: 50 })
  address: string;

  @Column("text", { name: "description" })
  description: string;

  @Column("decimal", {name:"average_rating",precision: 6, scale: 2 })
  averageRating:number;

  @Column("int", {name:"number_of_ratings"})
  numberOfRatings:number;

  @Column("int", {name:"rating"})
  rating:number;

  @OneToMany(() => Events, (events) => events.administrator)
  events: Events[];

  @OneToMany(() => Photos, (photos) => photos.administrator)
  photos: Photos[];

  @OneToMany(() => Logos, (logos) =>logos.administrator)
  logos: Logos[];

  @OneToMany(() => AdministratorToken, (administratorToken) => administratorToken.administrator)
  administratorTokens: AdministratorToken[];

  @OneToMany(() => Ratings, (ratings) => ratings.administrator)
  ratings: Ratings[];
}
