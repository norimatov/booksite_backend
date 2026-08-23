import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from './subscription.entity';
import { User } from '../users/user.entity';
import { NotificationsGateway } from '../notifications/notifications.gateway';

const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.MONTHLY]: 29000, // so'm
  [SubscriptionPlan.YEARLY]: 249000, // so'm (~2 oy tejam)
};

const PLAN_DURATION_DAYS: Record<SubscriptionPlan, number> = {
  [SubscriptionPlan.MONTHLY]: 30,
  [SubscriptionPlan.YEARLY]: 365,
};

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription) private repo: Repository<Subscription>,
    @InjectRepository(User) private usersRepo: Repository<User>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  getPlans() {
    return [
      {
        plan: SubscriptionPlan.MONTHLY,
        price: PLAN_PRICES.monthly,
        durationDays: PLAN_DURATION_DAYS.monthly,
        features: [
          'Reklamasiz o\'qish',
          'Barcha premium kitoblarga kirish',
          'Audiokitoblar',
          'Offline yuklab olish',
          'Cheksiz xatcho\'plar va shaxsiy izohlar',
        ],
      },
      {
        plan: SubscriptionPlan.YEARLY,
        price: PLAN_PRICES.yearly,
        durationDays: PLAN_DURATION_DAYS.yearly,
        features: [
          'Oylikdagi barcha imkoniyatlar',
          '2 oyga teng tejamkorlik',
          'Erta chiqadigan yangi kitoblarga ustuvor kirish',
          'Shaxsiy o\'qish tahlili (statistika)',
        ],
        badge: 'Eng foydali',
      },
    ];
  }

  // Eslatma: haqiqiy loyihada bu yerda to'lov provayderi (Payme/Click/Stripe)
  // webhook orqali tasdiqlanadi. Bu yerda soddalashtirilgan faollashtirish keltirilgan.
  async subscribe(user: User, plan: SubscriptionPlan) {
    const now = new Date();
    const endDate = new Date(
      now.getTime() + PLAN_DURATION_DAYS[plan] * 24 * 60 * 60 * 1000,
    );

    const subscription = this.repo.create({
      user,
      plan,
      status: SubscriptionStatus.ACTIVE,
      price: PLAN_PRICES[plan],
      startDate: now,
      endDate,
    });
    await this.repo.save(subscription);

    user.isPremium = true;
    user.premiumUntil = endDate;
    await this.usersRepo.save(user);

    this.notificationsGateway.notifyUser(user.id, 'premium:activated', {
      plan,
      endDate,
    });

    return subscription;
  }

  async cancel(user: User) {
    user.isPremium = false;
    user.premiumUntil = null;
    await this.usersRepo.save(user);

    await this.repo.update(
      { user: { id: user.id }, status: SubscriptionStatus.ACTIVE },
      { status: SubscriptionStatus.CANCELLED },
    );

    return { success: true };
  }

  findHistory(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
