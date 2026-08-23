import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async findProfile(id: string) {
    const user = await this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Foydalanuvchi topilmadi');
    const { passwordHash, ...safe } = user;
    return safe;
  }

  async updateProfile(id: string, data: Partial<User>) {
    await this.repo.update(id, data);
    return this.findProfile(id);
  }

  getStats(user: User) {
    return {
      readingStreak: user.readingStreak,
      totalReadingMinutes: user.totalReadingMinutes,
      isPremium: user.isPremium,
      premiumUntil: user.premiumUntil,
    };
  }
}
