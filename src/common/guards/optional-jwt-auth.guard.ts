import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Token bo'lsa foydalanuvchini biriktiradi, bo'lmasa ham so'rovni bloklamaydi
// (kitob ochilishida "mehmon" va "premium" holatlarini farqlash uchun)
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    return user || null;
  }
}
