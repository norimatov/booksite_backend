import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../users/user.entity';
import { OrderStatus } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Get('delivery-info')
  deliveryInfo() {
    return this.service.getDeliveryFee();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@CurrentUser() user: User, @Body() dto: CreateOrderDto) {
    return this.service.create(user, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  findMine(@CurrentUser() user: User) {
    return this.service.findMine(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@CurrentUser() user: User, @Param('id') id: string) {
    return this.service.cancel(user.id, id);
  }

  // Admin panel uchun: barcha buyurtmalar va holat boshqaruvi
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/all')
  findAllForAdmin() {
    return this.service.findAllForAdmin();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch('admin/:id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: OrderStatus) {
    return this.service.updateStatus(id, status);
  }
}
