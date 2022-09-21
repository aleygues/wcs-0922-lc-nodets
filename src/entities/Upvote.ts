import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Skill } from "./Skill";
import { Wilder } from "./Wilder";

@Entity()
export class Upvote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  upvotes: number;

  @ManyToOne(() => Skill, "upvotes")
  skill: Skill;

  @ManyToOne(() => Wilder, "upvotes", { onDelete: "CASCADE" })
  wilder: Wilder;
}
