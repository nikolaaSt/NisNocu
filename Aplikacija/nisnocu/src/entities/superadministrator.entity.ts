import { Column, Entity, Index, OneToMany } from "typeorm";
import { SuperadministratorToken } from "./superadministrator.token.entity";
import * as Validator from 'class-validator';

@Index("uq_superadministrator_username", ["username"], { unique: true })
@Entity("superadministrator", { schema: "nisnocu" })
export class Superadministrator {
  @Column("int", {
    primary: true,
    name: "superadministrator_id",
    unsigned: true,
  })
  superadministratorId: number;

  @Column("varchar", { name: "username", unique: true, length: 50 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Matches(/^[a-z][a-z0-9\.]{0,30}[a-z0-9]$/)
  username: string;

  @Column("varchar", { name: "password_hash", length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  @Validator.Length(6,30)
  passwordHash: string;

  @OneToMany(() => SuperadministratorToken, (superadministratorToken) => superadministratorToken.superadministrator)
  superadministratorTokens: SuperadministratorToken[];
}
