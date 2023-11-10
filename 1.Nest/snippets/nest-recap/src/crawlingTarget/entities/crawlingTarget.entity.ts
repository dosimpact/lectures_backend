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

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  docId: number; // doc id

  @Column({ type: 'varchar', length: 255, nullable: true })
  url: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isCrawled: boolean;

  @Column({ type: 'text', nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  originalPrompot: string;

  @Column({ type: 'text', nullable: true })
  contentHTML: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isRewrited: boolean;

  @Column({ type: 'text', nullable: true })
  rewritedTitle: string;

  @Column({ type: 'text', nullable: true })
  rewritedMarkdown: string;

  @Column({ type: 'text', nullable: true })
  rewritedHTML: string;

  @Column({ type: 'boolean', default: false, nullable: true })
  isConsumed: boolean;

  @Column({ type: 'varchar', length: 15, nullable: true })
  consumedTo: string; // 할당된 사람

  @Column({ type: 'boolean', default: false, nullable: true })
  isError: boolean;
}
