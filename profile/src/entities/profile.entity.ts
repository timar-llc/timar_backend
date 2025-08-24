import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ name: 'username', nullable: true })
  username: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ name: 'specialization', nullable: true })
  specialization: string;

  @Column({ name: 'cv', nullable: true })
  cv: string;

  @Column({ name: 'profile_completeness', nullable: true })
  profileCompleteness: number;

  @Column({ name: 'country_uuid', nullable: true })
  countryUuid: string;

  @Column({ name: 'user_uuid', nullable: true })
  userUuid: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
