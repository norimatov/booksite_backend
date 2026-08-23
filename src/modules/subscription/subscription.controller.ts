import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionPlan } from './subscription.entity';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('subscription')
export class SubscriptionController {
  constructor(private service: SubscriptionService) {}

  @Get('plans')
  getPlans() {
    return this.service.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Post('subscribe')
  subscribe(@CurrentUser() user: User, @Body() body: { plan: SubscriptionPlan }) {
    return this.service.subscribe(user, body.plan);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('cancel')
  cancel(@CurrentUser() user: User) {
    return this.service.cancel(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('history')
  history(@CurrentUser() user: User) {
    return this.service.findHistory(user.id);
  }
}
