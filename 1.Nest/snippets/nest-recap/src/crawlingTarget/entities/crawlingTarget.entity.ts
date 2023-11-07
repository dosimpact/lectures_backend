import {
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  VersionColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
export class CrawlingTargetEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @VersionColumn()
  version: number;

  @Column({ type: 'varchar', length: 15, nullable: true })
  svc: string; // 백과, 노하우

  @Index()
  @Column({ type: 'varchar', length: 63, nullable: true })
  dirId: string; // 카테고리

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, nullable: true })
  docId: number; // doc id

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isCrawled: boolean;

  @Column({ type: 'boolean', default: false, nullable: true })
  isRewrited: boolean;
}
