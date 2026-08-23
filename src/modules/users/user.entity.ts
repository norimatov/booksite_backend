import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ReadingProgress } from '../reading-progress/reading-progress.entity';
import { Bookmark } from '../bookmarks/bookmark.entity';
import { Review } from '../reviews/review.entity';
import { Subscription } from '../subscription/subscription.entity';

export enum UserRole {
  READER = 'reader',
  AUTHOR = 'author',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Index({ unique: true })
  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.READER })
  role: UserRole;

  @Column({ default: false })
  isPremium: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  premiumUntil: Date | null;

  // Kunlik o'qish davomiyligi (statistik maqsadda, "streak" hisoblash uchun)
  @Column({ default: 0 })
  readingStreak: number;

  @Column({ nullable: true, type: 'timestamptz' })
  lastReadAt: Date | null;

  @Column({ default: 0 })
  totalReadingMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ReadingProgress, (rp) => rp.user)
  readingProgress: ReadingProgress[];

  @OneToMany(() => Bookmark, (b) => b.user)
  bookmarks: Bookmark[];

  @OneToMany(() => Review, (r) => r.user)
  reviews: Review[];

  @OneToMany(() => Subscription, (s) => s.user)
  subscriptions: Subscription[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
