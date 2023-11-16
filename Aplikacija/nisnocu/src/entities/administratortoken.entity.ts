import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Administrator } from "./administrator.entity";
  
  @Index("fk_administrator_token_administrator_id", ["administratorId"], {})
  @Entity("administrator_token", { schema: "nisnocu" })
  export class AdministratorToken {
    @PrimaryGeneratedColumn({
      type: "int",
      name: "administrator_token_id",
      unsigned: true,
    })
    administratorTokenId: number;
  
    @Column("int", { name: "administrator_id", unsigned: true })
    administratorId: number;
  
    @Column("timestamp", {
      name: "created_at",
      default: () => "CURRENT_TIMESTAMP",
    })
    createdAt: Date;
  
    @Column("text", { name: "token" })
    token: string;
  
    @Column("datetime", { name: "expires_at" })
    expiresAt: string;
  
    @Column("tinyint", { name: "is_valid", unsigned: true, default: () => "'1'" })
    isValid: number;
  
    @ManyToOne(() => Administrator, (administrator) => administrator.administratorTokens, {
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "administrator_id", referencedColumnName: "administratorId" }])
    administrator: Administrator;
  }
  