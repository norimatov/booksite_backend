"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const subscription_entity_1 = require("./subscription.entity");
const user_entity_1 = require("../users/user.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const PLAN_PRICES = {
    [subscription_entity_1.SubscriptionPlan.MONTHLY]: 29000,
    [subscription_entity_1.SubscriptionPlan.YEARLY]: 249000,
};
const PLAN_DURATION_DAYS = {
    [subscription_entity_1.SubscriptionPlan.MONTHLY]: 30,
    [subscription_entity_1.SubscriptionPlan.YEARLY]: 365,
};
let SubscriptionService = class SubscriptionService {
    constructor(repo, usersRepo, notificationsGateway) {
        this.repo = repo;
        this.usersRepo = usersRepo;
        this.notificationsGateway = notificationsGateway;
    }
    getPlans() {
        return [
            {
                plan: subscription_entity_1.SubscriptionPlan.MONTHLY,
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
                plan: subscription_entity_1.SubscriptionPlan.YEARLY,
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
    async subscribe(user, plan) {
        const now = new Date();
        const endDate = new Date(now.getTime() + PLAN_DURATION_DAYS[plan] * 24 * 60 * 60 * 1000);
        const subscription = this.repo.create({
            user,
            plan,
            status: subscription_entity_1.SubscriptionStatus.ACTIVE,
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
    async cancel(user) {
        user.isPremium = false;
        user.premiumUntil = null;
        await this.usersRepo.save(user);
        await this.repo.update({ user: { id: user.id }, status: subscription_entity_1.SubscriptionStatus.ACTIVE }, { status: subscription_entity_1.SubscriptionStatus.CANCELLED });
        return { success: true };
    }
    findHistory(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.SubscriptionService = SubscriptionService;
exports.SubscriptionService = SubscriptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], SubscriptionService);
//# sourceMappingURL=subscription.service.js.map