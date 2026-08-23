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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const book_entity_1 = require("../books/book.entity");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const DEFAULT_BOOK_PRICE = 45000;
const DELIVERY_FEE = 15000;
let OrdersService = class OrdersService {
    constructor(repo, booksRepo, notificationsGateway) {
        this.repo = repo;
        this.booksRepo = booksRepo;
        this.notificationsGateway = notificationsGateway;
    }
    async create(user, dto) {
        const book = await this.booksRepo.findOne({ where: { id: dto.bookId } });
        if (!book)
            throw new common_1.NotFoundException('Kitob topilmadi');
        if (!book.deliveryAvailable) {
            throw new common_1.BadRequestException('Bu kitob uchun jismoniy yetkazib berish mavjud emas');
        }
        const quantity = dto.quantity && dto.quantity > 0 ? dto.quantity : 1;
        const unitPrice = book.price || DEFAULT_BOOK_PRICE;
        const totalPrice = unitPrice * quantity + DELIVERY_FEE;
        const order = this.repo.create({
            user,
            book,
            quantity,
            totalPrice,
            recipientName: dto.recipientName,
            phone: dto.phone,
            city: dto.city,
            address: dto.address,
            note: dto.note,
            status: order_entity_1.OrderStatus.PENDING,
        });
        await this.repo.save(order);
        this.notificationsGateway.notifyUser(user.id, 'order:created', {
            orderId: order.id,
            bookTitle: book.title,
            totalPrice,
        });
        return order;
    }
    findMine(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(userId, id) {
        const order = await this.repo.findOne({
            where: { id, user: { id: userId } },
        });
        if (!order)
            throw new common_1.NotFoundException('Buyurtma topilmadi');
        return order;
    }
    async cancel(userId, id) {
        const order = await this.findOne(userId, id);
        if (order.status === order_entity_1.OrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Yetkazib berilgan buyurtmani bekor qilib bo\'lmaydi');
        }
        order.status = order_entity_1.OrderStatus.CANCELLED;
        return this.repo.save(order);
    }
    async updateStatus(id, status) {
        const order = await this.repo.findOne({ where: { id }, relations: ['user', 'book'] });
        if (!order)
            throw new common_1.NotFoundException('Buyurtma topilmadi');
        order.status = status;
        await this.repo.save(order);
        this.notificationsGateway.notifyUser(order.user.id, 'order:statusChanged', {
            orderId: order.id,
            bookTitle: order.book?.title,
            status,
        });
        return order;
    }
    findAllForAdmin() {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }
    getDeliveryFee() {
        return { deliveryFee: DELIVERY_FEE, defaultBookPrice: DEFAULT_BOOK_PRICE };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_gateway_1.NotificationsGateway])
], OrdersService);
//# sourceMappingURL=orders.service.js.map