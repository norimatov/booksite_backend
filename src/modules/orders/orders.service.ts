import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './order.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

// Yetkazib berish uchun standart narx (agar kitobda narx belgilanmagan bo'lsa)
const DEFAULT_BOOK_PRICE = 45000; // so'm
const DELIVERY_FEE = 15000; // so'm

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(user: User, dto: CreateOrderDto) {
    const book = await this.booksRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    if (!book.deliveryAvailable) {
      throw new BadRequestException(
        'Bu kitob uchun jismoniy yetkazib berish mavjud emas',
      );
    }

    const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;
    const unitPrice = book.price || DEFAULT_BOOK_PRICE;
    const totalPrice = unitPrice * quantity + DELIVERY_FEE;

    const order = this.repo.create({
      user,
      book,
      quantity,
      totalPrice,
      recipientName: dto.recipientName,
      phone: dto.phone,
      city: dto.city,
      address: dto.address,
      note: dto.note,
      status: OrderStatus.PENDING,
    });
    await this.repo.save(order);

    this.notificationsGateway.notifyUser(user.id, 'order:created', {
      orderId: order.id,
      bookTitle: book.title,
      totalPrice,
    });

    return order;
  }

  findMine(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string) {
    const order = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    return order;
  }

  async cancel(userId: string, id: string) {
    const order = await this.findOne(userId, id);
    if (order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'Yetkazib berilgan buyurtmani bekor qilib bo\'lmaydi',
      );
    }
    order.status = OrderStatus.CANCELLED;
    return this.repo.save(order);
  }

  // Faqat administrator uchun: buyurtma holatini yangilash (tasdiqlash,
  // yo'lga chiqarish, yetkazib berilganini belgilash) va foydalanuvchiga
  // real-vaqt bildirishnoma yuborish
  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.repo.findOne({ where: { id }, relations: ['user', 'book'] });
    if (!order) throw new NotFoundException('Buyurtma topilmadi');
    order.status = status;
    await this.repo.save(order);

    this.notificationsGateway.notifyUser(order.user.id, 'order:statusChanged', {
      orderId: order.id,
      bookTitle: order.book?.title,
      status,
    });

    return order;
  }

  findAllForAdmin() {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  getDeliveryFee() {
    return { deliveryFee: DELIVERY_FEE, defaultBookPrice: DEFAULT_BOOK_PRICE };
  }
}
