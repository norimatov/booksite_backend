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
exports.NotificationsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let NotificationsGateway = class NotificationsGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger('NotificationsGateway');
        this.onlineUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth?.token ||
                client.handshake.headers?.authorization?.replace('Bearer ', '');
            if (!token) {
                client.data.guest = true;
                return;
            }
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });
            client.data.userId = payload.sub;
            this.onlineUsers.set(client.id, payload.sub);
            client.join(`user:${payload.sub}`);
            this.server.emit('presence:update', { onlineCount: this.onlineUsers.size });
            this.logger.log(`Ulandi: ${payload.sub}`);
        }
        catch (e) {
            client.data.guest = true;
        }
    }
    handleDisconnect(client) {
        this.onlineUsers.delete(client.id);
        this.server.emit('presence:update', { onlineCount: this.onlineUsers.size });
    }
    handleJoinBookRoom(client, data) {
        client.join(`book:${data.bookId}`);
        return { event: 'book:joined', bookId: data.bookId };
    }
    handleLeaveBookRoom(client, data) {
        client.leave(`book:${data.bookId}`);
    }
    handleLiveComment(client, data) {
        this.server.to(`book:${data.bookId}`).emit('book:newComment', {
            ...data,
            at: new Date().toISOString(),
        });
    }
    broadcastReadingActivity(userId, payload) {
        this.server.emit('activity:reading', payload);
    }
    notifyUser(userId, event, payload) {
        this.server.to(`user:${userId}`).emit(event, payload);
    }
    broadcastAnnouncement(payload) {
        this.server.emit('announcement', payload);
    }
};
exports.NotificationsGateway = NotificationsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], NotificationsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('book:join'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleJoinBookRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('book:leave'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleLeaveBookRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('book:comment'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], NotificationsGateway.prototype, "handleLiveComment", null);
exports.NotificationsGateway = NotificationsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/realtime',
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], NotificationsGateway);
//# sourceMappingURL=notifications.gateway.js.map