import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_technologies' })
export class UserTechnology {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  technologyUuid: string;

  @Column()
  userUuid: string;
}
