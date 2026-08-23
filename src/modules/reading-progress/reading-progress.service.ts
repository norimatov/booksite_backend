import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReadingProgress } from './reading-progress.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ReadingProgressService {
  constructor(
    @InjectRepository(ReadingProgress) private repo: Repository<ReadingProgress>,
    @InjectRepository(Book) private booksRepo: Repository<Book>,
    @InjectRepository(User) private usersRepo: Repository<User>,
  ) {}

  async upsertProgress(user: User, dto: UpdateProgressDto) {
    const book = await this.booksRepo.findOne({ where: { id: dto.bookId } });
    if (!book) throw new NotFoundException('Kitob topilmadi');

    let progress = await this.repo.findOne({
      where: { user: { id: user.id }, book: { id: dto.bookId } },
      relations: ['user', 'book'],
    });

    const percent = book.totalPages
      ? Math.min(100, (dto.currentPage / book.totalPages) * 100)
      : 0;

    if (!progress) {
      progress = this.repo.create({ user, book });
      book.startedCount += 1;
      await this.booksRepo.save(book);
    }
    progress.currentPage = dto.currentPage;
    progress.percentComplete = percent;
    progress.isFinished = percent >= 100;
    progress.sessionMinutes += dto.sessionMinutesDelta;
    await this.repo.save(progress);

    // Foydalanuvchi statistikasini yangilash (kunlik streak va umumiy vaqt)
    const today = new Date();
    const wasSameDay =
      user.lastReadAt &&
      new Date(user.lastReadAt).toDateString() === today.toDateString();
    if (!wasSameDay) {
      const wasYesterday =
        user.lastReadAt &&
        new Date(user.lastReadAt).toDateString() ===
          new Date(today.getTime() - 86400000).toDateString();
      user.readingStreak = wasYesterday ? user.readingStreak + 1 : 1;
    }
    user.lastReadAt = today;
    user.totalReadingMinutes += dto.sessionMinutesDelta;
    await this.usersRepo.save(user);

    return progress;
  }

  async findMyProgress(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ['book'],
      order: { lastReadAt: 'DESC' },
    });
  }

  async findForBook(userId: string, bookId: string) {
    return this.repo.findOne({
      where: { user: { id: userId }, book: { id: bookId } },
    });
  }
}
