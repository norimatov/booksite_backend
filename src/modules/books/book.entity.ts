import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  Index,
} from 'typeorm';
import { Category } from '../categories/category.entity';
import { ReadingProgress } from '../reading-progress/reading-progress.entity';
import { Review } from '../reviews/review.entity';

export enum BookFormat {
  TEXT = 'text',
  AUDIO = 'audio',
  BOTH = 'both',
}

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  coverUrl: string;

  @Column({ type: 'text', nullable: true })
  contentUrl: string; // matn fayli yoki bo'limlar manzili

  @Column({ nullable: true })
  audioUrl: string; // premium audiokitob fayli

  @Column({ type: 'enum', enum: BookFormat, default: BookFormat.TEXT })
  format: BookFormat;

  @Column({ default: 0 })
  totalPages: number;

  @Column({ default: false })
  isPremiumOnly: boolean; // faqat premium foydalanuvchilar uchun

  @Column({ default: 0 })
  viewsCount: number;

  @Column({ default: 0 })
  startedCount: number; // nechta foydalanuvchi bu kitobni o'qishni boshlagan

  @Column({ type: 'float', nullable: true })
  price: number; // qog'oz nusxa narxi (yetkazib berish uchun), null = sotilmaydi

  @Column({ default: true })
  deliveryAvailable: boolean; // jismoniy yetkazib berish mavjudmi

  @Column({ type: 'float', default: 0 })
  averageRating: number;

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  publishedYear: number;

  @ManyToMany(() => Category, (category) => category.books)
  @JoinTable({
    name: 'book_categories',
    joinColumn: { name: 'bookId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => ReadingProgress, (rp) => rp.book)
  readingProgress: ReadingProgress[];

  @OneToMany(() => Review, (r) => r.book)
  reviews: Review[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
