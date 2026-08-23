import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Entity('reading_progress')
@Unique(['user', 'book'])
export class ReadingProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, (u) => u.readingProgress, { onDelete: 'CASCADE' })
  user: User;

  @Index()
  @ManyToOne(() => Book, (b) => b.readingProgress, { onDelete: 'CASCADE' })
  book: Book;

  @Column({ default: 0 })
  currentPage: number;

  @Column({ type: 'float', default: 0 })
  percentComplete: number;

  @Column({ default: false })
  isFinished: boolean;

  @Column({ default: 0 })
  sessionMinutes: number; // shu kitobga sarflangan umumiy vaqt (daqiqa)

  @UpdateDateColumn({ type: 'timestamptz' })
  lastReadAt: Date;
}
