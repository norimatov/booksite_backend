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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const book_entity_1 = require("./book.entity");
const category_entity_1 = require("../categories/category.entity");
let BooksService = class BooksService {
    constructor(booksRepo, categoriesRepo) {
        this.booksRepo = booksRepo;
        this.categoriesRepo = categoriesRepo;
    }
    async findAll(query) {
        const page = parseInt(query.page || '1', 10);
        const limit = Math.min(parseInt(query.limit || '20', 10), 50);
        const qb = this.booksRepo
            .createQueryBuilder('book')
            .leftJoinAndSelect('book.categories', 'category');
        if (query.search) {
            qb.andWhere('(book.title ILIKE :s OR book.author ILIKE :s)', {
                s: `%${query.search}%`,
            });
        }
        if (query.categoryId) {
            qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
        }
        if (query.premiumOnly === 'true') {
            qb.andWhere('book.isPremiumOnly = true');
        }
        switch (query.sort) {
            case 'popular':
                qb.orderBy('book.viewsCount', 'DESC');
                break;
            case 'rating':
                qb.orderBy('book.averageRating', 'DESC');
                break;
            default:
                qb.orderBy('book.createdAt', 'DESC');
        }
        qb.skip((page - 1) * limit).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findOne(id, currentUser) {
        const book = await this.booksRepo.findOne({
            where: { id },
            relations: ['categories'],
        });
        if (!book)
            throw new common_1.NotFoundException('Kitob topilmadi');
        if (book.isPremiumOnly && !currentUser?.isPremium) {
            const { contentUrl, audioUrl, ...preview } = book;
            throw new common_1.ForbiddenException({
                message: 'Bu kitob faqat Premium foydalanuvchilar uchun',
                preview,
            });
        }
        book.viewsCount += 1;
        await this.booksRepo.save(book);
        return book;
    }
    async create(dto) {
        const categories = dto.categoryIds?.length
            ? await this.categoriesRepo.findBy({ id: (0, typeorm_2.In)(dto.categoryIds) })
            : [];
        const book = this.booksRepo.create({ ...dto, categories });
        return this.booksRepo.save(book);
    }
    async recalculateRating(bookId, newAverage, reviewsCount) {
        await this.booksRepo.update(bookId, {
            averageRating: newAverage,
            reviewsCount,
        });
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BooksService);
//# sourceMappingURL=books.service.js.map