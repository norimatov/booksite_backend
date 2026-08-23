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
exports.BookmarksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bookmark_entity_1 = require("./bookmark.entity");
const book_entity_1 = require("../books/book.entity");
let BookmarksService = class BookmarksService {
    constructor(repo, booksRepo) {
        this.repo = repo;
        this.booksRepo = booksRepo;
    }
    async create(user, bookId, pageNumber, note) {
        const book = await this.booksRepo.findOne({ where: { id: bookId } });
        if (!book)
            throw new common_1.NotFoundException('Kitob topilmadi');
        const bookmark = this.repo.create({ user, book, pageNumber, note });
        return this.repo.save(bookmark);
    }
    findAllForUser(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }
    async remove(userId, id) {
        const bookmark = await this.repo.findOne({
            where: { id, user: { id: userId } },
        });
        if (!bookmark)
            throw new common_1.NotFoundException('Xatcho\'p topilmadi');
        await this.repo.remove(bookmark);
        return { success: true };
    }
};
exports.BookmarksService = BookmarksService;
exports.BookmarksService = BookmarksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bookmark_entity_1.Bookmark)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BookmarksService);
//# sourceMappingURL=bookmarks.service.js.map