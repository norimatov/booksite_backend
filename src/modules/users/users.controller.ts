import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private service: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: User) {
    return this.service.findProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/stats')
  stats(@CurrentUser() user: User) {
    return this.service.getStats(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@CurrentUser() user: User, @Body() body: Partial<User>) {
    return this.service.updateProfile(user.id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findProfile(id);
  }
}
