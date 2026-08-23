"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const typeorm_config_1 = require("./config/typeorm.config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const books_module_1 = require("./modules/books/books.module");
const categories_module_1 = require("./modules/categories/categories.module");
const reading_progress_module_1 = require("./modules/reading-progress/reading-progress.module");
const bookmarks_module_1 = require("./modules/bookmarks/bookmarks.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const subscription_module_1 = require("./modules/subscription/subscription.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const orders_module_1 = require("./modules/orders/orders.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRoot(typeorm_config_1.typeOrmConfig),
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            books_module_1.BooksModule,
            categories_module_1.CategoriesModule,
            reading_progress_module_1.ReadingProgressModule,
            bookmarks_module_1.BookmarksModule,
            reviews_module_1.ReviewsModule,
            subscription_module_1.SubscriptionModule,
            notifications_module_1.NotificationsModule,
            orders_module_1.OrdersModule,
        ],
        providers: [{ provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard }],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map