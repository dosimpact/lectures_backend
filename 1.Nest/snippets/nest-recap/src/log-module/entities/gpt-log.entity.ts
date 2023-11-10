import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GptLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column()
  targetId: number;

  @Column({ nullable: true })
  tokens: number;

  @Column({ type: 'decimal', nullable: true })
  latency: number;
}
