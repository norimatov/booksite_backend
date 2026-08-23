import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @CurrentUser() user: User,
    @Body() body: { bookId: string; rating: number; comment?: string },
  ) {
    return this.service.create(user, body.bookId, body.rating, body.comment);
  }

  @Get('book/:bookId')
  findForBook(@Param('bookId') bookId: string) {
    return this.service.findForBook(bookId);
  }
}
