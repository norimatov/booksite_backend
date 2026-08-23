import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ReadingProgressService } from './reading-progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@UseGuards(JwtAuthGuard)
@Controller('reading-progress')
export class ReadingProgressController {
  constructor(
    private service: ReadingProgressService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Post()
  async update(@CurrentUser() user: User, @Body() dto: UpdateProgressDto) {
    const progress = await this.service.upsertProgress(user, dto);
    // Real-vaqt: do'stlarga/kuzatuvchilarga o'qish faolligi haqida signal
    this.notificationsGateway.broadcastReadingActivity(user.id, {
      userId: user.id,
      fullName: user.fullName,
      bookId: dto.bookId,
      percentComplete: progress.percentComplete,
    });
    return progress;
  }

  @Get('me')
  findMine(@CurrentUser() user: User) {
    return this.service.findMyProgress(user.id);
  }

  @Get(':bookId')
  findForBook(@CurrentUser() user: User, @Param('bookId') bookId: string) {
    return this.service.findForBook(user.id, bookId);
  }
}
