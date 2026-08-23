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
exports.ReadingProgressService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reading_progress_entity_1 = require("./reading-progress.entity");
const book_entity_1 = require("../books/book.entity");
const user_entity_1 = require("../users/user.entity");
let ReadingProgressService = class ReadingProgressService {
    constructor(repo, booksRepo, usersRepo) {
        this.repo = repo;
        this.booksRepo = booksRepo;
        this.usersRepo = usersRepo;
    }
    async upsertProgress(user, dto) {
        const book = await this.booksRepo.findOne({ where: { id: dto.bookId } });
        if (!book)
            throw new common_1.NotFoundException('Kitob topilmadi');
        let progress = await this.repo.findOne({
            where: { user: { id: user.id }, book: { id: dto.bookId } },
            relations: ['user', 'book'],
        });
        const percent = book.totalPages
            ? Math.min(100, (dto.currentPage / book.totalPages) * 100)
            : 0;
        if (!progress) {
            progress = this.repo.create({ user, book });
            book.startedCount += 1;
            await this.booksRepo.save(book);
        }
        progress.currentPage = dto.currentPage;
        progress.percentComplete = percent;
        progress.isFinished = percent >= 100;
        progress.sessionMinutes += dto.sessionMinutesDelta;
        await this.repo.save(progress);
        const today = new Date();
        const wasSameDay = user.lastReadAt &&
            new Date(user.lastReadAt).toDateString() === today.toDateString();
        if (!wasSameDay) {
            const wasYesterday = user.lastReadAt &&
                new Date(user.lastReadAt).toDateString() ===
                    new Date(today.getTime() - 86400000).toDateString();
            user.readingStreak = wasYesterday ? user.readingStreak + 1 : 1;
        }
        user.lastReadAt = today;
        user.totalReadingMinutes += dto.sessionMinutesDelta;
        await this.usersRepo.save(user);
        return progress;
    }
    async findMyProgress(userId) {
        return this.repo.find({
            where: { user: { id: userId } },
            relations: ['book'],
            order: { lastReadAt: 'DESC' },
        });
    }
    async findForBook(userId, bookId) {
        return this.repo.findOne({
            where: { user: { id: userId }, book: { id: bookId } },
        });
    }
};
exports.ReadingProgressService = ReadingProgressService;
exports.ReadingProgressService = ReadingProgressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reading_progress_entity_1.ReadingProgress)),
    __param(1, (0, typeorm_1.InjectRepository)(book_entity_1.Book)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReadingProgressService);
//# sourceMappingURL=reading-progress.service.js.map