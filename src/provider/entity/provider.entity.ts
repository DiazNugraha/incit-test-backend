import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oauth_providers')
export class ProviderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', nullable: false, unique: true })
  name: string;

  @Column({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
