import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './bookmark.entity';
import { User } from '../users/user.entity';
import { Book } from '../books/book.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private repo: Repository<Bookmark>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
  ) {}

  async create(user: User, bookId: string, pageNumber: number, note?: string) {
    const book = await this.booksRepo.findOne({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');
    const bookmark = this.repo.create({ user, book, pageNumber, note });
    return this.repo.save(bookmark);
  }

  findAllForUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async remove(userId: string, id: string) {
    const bookmark = await this.repo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!bookmark) throw new NotFoundException('Xatcho\'p topilmadi');
    await this.repo.remove(bookmark);
    return { success: true };
  }
}
