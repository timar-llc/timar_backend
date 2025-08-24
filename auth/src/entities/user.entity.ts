import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({ name: 'verification_code', nullable: true })
  verificationCode: string;

  @Column({ name: 'email_confirmed', default: false })
  emailConfirmed: boolean;

  @Column({ name: 'telegram_id', nullable: true })
  telegramId: string;

  @Column({ name: 'github_id', nullable: true })
  githubId: string;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
