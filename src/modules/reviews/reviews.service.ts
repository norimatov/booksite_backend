import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private repo: Repository<Review>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  async create(user: User, bookId: string, rating: number, comment?: string) {
    const book = await this.booksRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    const review = this.repo.create({ user, book, rating, comment });
    await this.repo.save(review);

    // O'rtacha reytingni qayta hisoblash
    const { avg, count } = await this.repo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.bookId = :bookId', { bookId })
      .getRawOne();

    await this.booksRepo.update(bookId, {
      averageRating: parseFloat(avg) || 0,
      reviewsCount: parseInt(count, 10) || 0,
    });

    return review;
  }

  findForBook(bookId: string) {
    return this.repo.find({
      where: { book: { id: bookId } },
      order: { createdAt: 'DESC' },
    });
  }
}
