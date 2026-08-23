import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface ReadingActivityPayload {
  userId: string;
  fullName: string;
  bookId: string;
  percentComplete: number;
}

/**
 * WebSocket gateway - real-vaqt funksiyalar:
 * - Foydalanuvchi ulanganda online statusi
 * - O'qish faolligi eshittirilishi (kim, qaysi kitobni, necha foizini o'qiyapti)
 * - Kitob bo'yicha "live" izoh/muhokama xonalari (roomlar)
 * - Premium foydalanuvchilar uchun shaxsiy bildirishnomalar (masalan yangi kitob chiqishi)
 */
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/realtime',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('NotificationsGateway');
  private onlineUsers = new Map<string, string>(); // socketId -> userId

  constructor(private jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token =
        client.handshake.auth?.token ||
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
    } catch (e) {
      client.data.guest = true;
    }
  }

  handleDisconnect(client: Socket) {
    this.onlineUsers.delete(client.id);
    this.server.emit('presence:update', { onlineCount: this.onlineUsers.size });
  }

  @SubscribeMessage('book:join')
  handleJoinBookRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookId: string },
  ) {
    client.join(`book:${data.bookId}`);
    return { event: 'book:joined', bookId: data.bookId };
  }

  @SubscribeMessage('book:leave')
  handleLeaveBookRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookId: string },
  ) {
    client.leave(`book:${data.bookId}`);
  }

  // Kitob sahifasida "live" izoh yozish (masalan boshqa o'quvchilar shu daqiqada ko'radi)
  @SubscribeMessage('book:comment')
  handleLiveComment(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { bookId: string; page: number; text: string; fullName: string },
  ) {
    this.server.to(`book:${data.bookId}`).emit('book:newComment', {
      ...data,
      at: new Date().toISOString(),
    });
  }

  // REST controllerlardan chaqiriladi - do'stlarga real-vaqt faollik signali
  broadcastReadingActivity(userId: string, payload: ReadingActivityPayload) {
    this.server.emit('activity:reading', payload);
  }

  // Premium foydalanuvchiga shaxsiy bildirishnoma (masalan yangi audiokitob)
  notifyUser(userId: string, event: string, payload: any) {
    this.server.to(`user:${userId}`).emit(event, payload);
  }

  // Barcha ulanganlarga umumiy e'lon (masalan yangi kitob nashr etildi)
  broadcastAnnouncement(payload: { title: string; message: string }) {
    this.server.emit('announcement', payload);
  }
}
