import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('bookmarks')
export class BookmarksController {
  constructor(private service: BookmarksService) {}

  @Post()
  create(
    @CurrentUser() user: User,
    @Body() body: { bookId: string; pageNumber: number; note?: string },
  ) {
    return this.service.create(user, body.bookId, body.pageNumber, body.note);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.service.findAllForUser(user.id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.remove(user.id, id);
  }
}
