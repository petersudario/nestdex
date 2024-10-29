import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Pokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  imageUrl: string;

  @Column()
  attack: string;
}