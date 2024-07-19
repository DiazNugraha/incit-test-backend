import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user_oauth')
export class UserOauthEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'provider_id', type: 'int' })
  providerId: number;

  @Column({ name: 'access_token', type: 'varchar' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'varchar' })
  refreshToken: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
