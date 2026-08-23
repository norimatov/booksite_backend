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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("./review.entity");
const book_entity_1 = require("../books/book.entity");
let ReviewsService = class ReviewsService {
    constructor(repo, booksRepo) {
        this.repo = repo;
        this.booksRepo = booksRepo;
    }
    async create(user, bookId, rating, comment) {
        const book = await this.booksRepo.findOne({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Kitob topilmadi');
        const review = this.repo.create({ user, book, rating, comment });
        await this.repo.save(review);
        const { avg, count } = await this.repo
            .createQueryBuilder('r')
            .select('AVG(r.rating)', 'avg')
            .addSelect('COUNT(r.id)', 'count')
            .where('r.bookId = :bookId', { bookId })
            .getRawOne();
        await this.booksRepo.update(bookId, {
            averageRating: parseFloat(avg) || 0,
            reviewsCount: parseInt(count, 10) || 0,
        });
        return review;
    }
    findForBook(bookId) {
        return this.repo.find({
            where: { book: { id: bookId } },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map