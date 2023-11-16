import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Superadministrator } from "./superadministrator.entity";
  
  @Index("fk_superadministrator_token_superadministrator_id", ["superadministratorId"], {})
  @Entity("superadministrator_token", { schema: "nisnocu" })
  export class SuperadministratorToken {
    @PrimaryGeneratedColumn({
      type: "int",
      name: "superadministrator_token_id",
      unsigned: true,
    })
    superadministratorTokenId: number;
  
    @Column("int", { name: "superadministrator_id", unsigned: true })
    superadministratorId: number;
  
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
  
    @ManyToOne(() => Superadministrator, (superadministrator) => superadministrator.superadministratorTokens, {
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "superadministrator_id", referencedColumnName: "superadministratorId" }])
    superadministrator: Superadministrator;
  }
  