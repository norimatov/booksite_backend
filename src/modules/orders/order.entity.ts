import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

export enum OrderStatus {
  PENDING = 'pending',       // kutilmoqda (tasdiqlanmagan)
  CONFIRMED = 'confirmed',   // tasdiqlandi
  SHIPPED = 'shipped',       // yo'lda
  DELIVERED = 'delivered',   // yetkazildi
  CANCELLED = 'cancelled',   // bekor qilindi
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @ManyToOne(() => User, { onDelete: 'CASCADE', eager: true })
  user: User;

  @ManyToOne(() => Book, { onDelete: 'SET NULL', eager: true, nullable: true })
  book: Book;

  @Column({ default: 1 })
  quantity: number;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column()
  recipientName: string;

  @Column()
  phone: string;

  @Column()
  city: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
