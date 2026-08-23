import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingProgress } from './reading-progress.entity';
import { Book } from '../books/book.entity';
import { User } from '../users/user.entity';
import { ReadingProgressService } from './reading-progress.service';
import { ReadingProgressController } from './reading-progress.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReadingProgress, Book, User]),
    NotificationsModule,
  ],
  providers: [ReadingProgressService],
  controllers: [ReadingProgressController],
})
export class ReadingProgressModule {}
