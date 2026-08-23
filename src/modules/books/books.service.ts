import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Book } from './book.entity';
import { Category } from '../categories/category.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { User } from '../users/user.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(Category) private categoriesRepo: Repository<Category>,
  ) {}

  async findAll(query: QueryBooksDto) {
    const page = parseInt(query.page || '1', 10);
    const limit = Math.min(parseInt(query.limit || '20', 10), 50);

    const qb = this.booksRepo
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.categories', 'category');

    if (query.search) {
      qb.andWhere('(book.title ILIKE :s OR book.author ILIKE :s)', {
        s: `%${query.search}%`,
      });
    }
    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
    }
    if (query.premiumOnly === 'true') {
      qb.andWhere('book.isPremiumOnly = true');
    }

    switch (query.sort) {
      case 'popular':
        qb.orderBy('book.viewsCount', 'DESC');
        break;
      case 'rating':
        qb.orderBy('book.averageRating', 'DESC');
        break;
      default:
        qb.orderBy('book.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, currentUser?: User) {
    const book = await this.booksRepo.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    // Premium kitob himoyasi: matn/audio manzili faqat premium foydalanuvchiga ko'rsatiladi
    if (book.isPremiumOnly && !currentUser?.isPremium) {
      const { contentUrl, audioUrl, ...preview } = book;
      throw new ForbiddenException({
        message: 'Bu kitob faqat Premium foydalanuvchilar uchun',
        preview,
      });
    }

    book.viewsCount += 1;
    await this.booksRepo.save(book);
    return book;
  }

  async create(dto: CreateBookDto) {
    const categories = dto.categoryIds?.length
      ? await this.categoriesRepo.findBy({ id: In(dto.categoryIds) })
      : [];
    const book = this.booksRepo.create({ ...dto, categories });
    return this.booksRepo.save(book);
  }

  async recalculateRating(bookId: string, newAverage: number, reviewsCount: number) {
    await this.booksRepo.update(bookId, {
      averageRating: newAverage,
      reviewsCount,
    });
  }
}
