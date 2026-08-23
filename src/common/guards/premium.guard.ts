import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PREMIUM_KEY } from '../decorators/premium.decorator';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresPremium = this.reflector.getAllAndOverride<boolean>(
      PREMIUM_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiresPremium) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.isPremium) {
      throw new ForbiddenException(
        'Bu funksiya faqat Premium foydalanuvchilar uchun mavjud',
      );
    }
    return true;
  }
}
