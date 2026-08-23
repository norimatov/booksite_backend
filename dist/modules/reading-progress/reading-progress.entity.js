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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingProgress = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const book_entity_1 = require("../books/book.entity");
let ReadingProgress = class ReadingProgress {
};
exports.ReadingProgress = ReadingProgress;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReadingProgress.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (u) => u.readingProgress, { onDelete: 'CASCADE' }),
    __metadata("design:type", user_entity_1.User)
], ReadingProgress.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.ManyToOne)(() => book_entity_1.Book, (b) => b.readingProgress, { onDelete: 'CASCADE' }),
    __metadata("design:type", book_entity_1.Book)
], ReadingProgress.prototype, "book", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ReadingProgress.prototype, "currentPage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float', default: 0 }),
    __metadata("design:type", Number)
], ReadingProgress.prototype, "percentComplete", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ReadingProgress.prototype, "isFinished", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], ReadingProgress.prototype, "sessionMinutes", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], ReadingProgress.prototype, "lastReadAt", void 0);
exports.ReadingProgress = ReadingProgress = __decorate([
    (0, typeorm_1.Entity)('reading_progress'),
    (0, typeorm_1.Unique)(['user', 'book'])
], ReadingProgress);
//# sourceMappingURL=reading-progress.entity.js.map