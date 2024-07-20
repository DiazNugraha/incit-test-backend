import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'email', type: 'varchar', unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: true })
  password: string | null;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @Column({ name: 'login_count', type: 'int' })
  loginCount: number;

  @Column({ name: 'last_login_at', type: 'timestamp' })
  lastLoginAt: Date;

  @Column({ name: 'last_logout_at', type: 'timestamp' })
  lastLogoutAt: Date;

  @Column({ name: 'email_verified', type: 'boolean' })
  emailVerified: boolean;

  @Column({ name: 'email_verification_token', type: 'varchar' })
  emailVerificationToken: string;
}
