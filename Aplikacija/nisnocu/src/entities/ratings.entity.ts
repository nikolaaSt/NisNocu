import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "./user.entity";
import { Administrator } from "./administrator.entity";
  
  @Index("fk_ratings_user_id", ["userId"], {})
  @Index("fk_ratings_administrator_id", ["administratorId"], {})
  @Entity("ratings", { schema: "nisnocu" })
  export class Ratings {
    @PrimaryGeneratedColumn({
      type: "int",
      name: "rating_id",
      unsigned: true,
    })
    ratingId: number;
  
    @Column("int", { name: "administrator_id", unsigned: true })
    administratorId: number;
  
    @Column("int", { name: "user_id", unsigned: true })
    userId: number;

    @Column("text", { name: "comment"})
    comment: string;
  
    @Column("int", {
      name: "rating",
    })
    rating:number;
  
  
    @ManyToOne(
      () => User,
      (user) => user.ratings,
      { onDelete: "RESTRICT", onUpdate: "CASCADE" }
    )
    @JoinColumn([
      { name: "user_id", referencedColumnName: "userId" },
    ])
    user: User;
  
    @ManyToOne(() => Administrator, (administrator) => administrator.ratings, {
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    })
    @JoinColumn([{ name: "administrator_id", referencedColumnName: "administratorId" }])
    administrator:Administrator;
  
  }
  