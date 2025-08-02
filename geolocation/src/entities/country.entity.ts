import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  code: string;

  name: string;
}
