import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";

@Index("fk_user_token_user_id", ["userId"], {})
@Entity("user_token", { schema: "nisnocu" })
export class UserToken {
  @PrimaryGeneratedColumn({
    type: "int",
    name: "user_token_id",
    unsigned: true,
  })
  userTokenId: number;

  @Column("int", { name: "user_id", unsigned: true })
  userId: number;

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

  @ManyToOne(() => User, (user) => user.userTokens, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_id", referencedColumnName: "userId" }])
  user: User;
}
