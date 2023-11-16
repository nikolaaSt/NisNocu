import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Photos } from "./photos.entity";
import { UserToken } from "./usertoken.entity";
import { Reservations } from "./reservations.entity";
import { Ratings } from "./ratings.entity";
import * as Validator from 'class-validator'

@Index("uq_user_email", ["email"], { unique: true })
@Index("uq_user_nickname", ["nickname"], { unique: true })
@Index("uq_user_phone_number", ["phoneNumber"], { unique: true })
@Entity("user")
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", {
    name: "email",
    unique: true,
    length: 50,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9.@]{0,30}[a-z0-9]$/)
  email: string;

  @Column("varchar", {
    name: "password_hash",
    length: 128,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.Length(6,30)
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("varchar", { name: "forename", length: 30, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  forename: string;

  @Column("varchar", { name: "surname", length: 30, default: () => "'0'" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  surname: string;

  @Column("varchar", {
    name: "nickname",
    unique: true,
    length: 30,
    default: () => "'0'",
  })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  nickname: string;

  @Column("varchar", { name: "phone_number", unique: true, length: 24 })
  phoneNumber: string;


  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[];

  @OneToMany(() => Reservations, (reservations) => reservations.user)
  reservations: Reservations[];

  @OneToMany(() => Ratings, (ratings) => ratings.user)
  ratings: Ratings[];
}
