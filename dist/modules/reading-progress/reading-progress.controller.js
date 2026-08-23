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
exports.ReadingProgressController = void 0;
const common_1 = require("@nestjs/common");
const reading_progress_service_1 = require("./reading-progress.service");
const update_progress_dto_1 = require("./dto/update-progress.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_1 = require("../users/user.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let ReadingProgressController = class ReadingProgressController {
    constructor(service, notificationsGateway) {
        this.service = service;
        this.notificationsGateway = notificationsGateway;
    }
    async update(user, dto) {
        const progress = await this.service.upsertProgress(user, dto);
        this.notificationsGateway.broadcastReadingActivity(user.id, {
            userId: user.id,
            fullName: user.fullName,
            bookId: dto.bookId,
            percentComplete: progress.percentComplete,
        });
        return progress;
    }
    findMine(user) {
        return this.service.findMyProgress(user.id);
    }
    findForBook(user, bookId) {
        return this.service.findForBook(user.id, bookId);
    }
};
exports.ReadingProgressController = ReadingProgressController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, update_progress_dto_1.UpdateProgressDto]),
    __metadata("design:returntype", Promise)
], ReadingProgressController.prototype, "update", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], ReadingProgressController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)(':bookId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('bookId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", void 0)
], ReadingProgressController.prototype, "findForBook", null);
exports.ReadingProgressController = ReadingProgressController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('reading-progress'),
    __metadata("design:paramtypes", [reading_progress_service_1.ReadingProgressService,
        notifications_gateway_1.NotificationsGateway])
], ReadingProgressController);
//# sourceMappingURL=reading-progress.controller.js.map