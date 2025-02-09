import { Inject, Injectable, Logger } from '@nestjs/common';
import * as createEmitter from 'socket.io-emitter';
import { SocketWithToken } from '../../ws/interfaces/ws-socket-local.interface';
import { environment } from '../../environments';
import { NATIVE_REDIS_CLIENT_INJECTION_TOKEN } from '../../const';
import { RedisClient } from '@pe/nest-kit';

@Injectable()
export class SocketIoEmitterService {
  public servers: any = { };
  private emitter = createEmitter(this.redisClient.getClient().duplicate());
  protected sockets: Map<string, SocketWithToken> = new Map();

  constructor(
    private redisClient: RedisClient,
    private readonly logger: Logger,
  ) {
    this.initEmitter();
  }
  
  public to(room: string): ReturnType<typeof createEmitter> {
    return this.emitter.to(room);
  }

  public of(namespace: string): ReturnType<typeof createEmitter> {
    return this.emitter.of(namespace);
  }

  public emit(event: string, ...args: any[]): ReturnType<typeof createEmitter> {
    return this.emitter.emit(event, ...args);
  }

  public addSocket(socket: SocketWithToken): void {
    this.sockets.set(socket.id, socket);
  }

  public removeSocket(socketId: string): void {
    this.sockets.delete(socketId);
  }

  public getSocket(socketId: string): SocketWithToken {
    return this.sockets.get(socketId);
  }

  private initEmitter(): void {
    this.emitter = createEmitter(this.redisClient.getClient().duplicate());
    this.emitter.redis.on('error', (err: any) => {
      this.logger.error(err);
      this.initEmitter();
    });

    this.emitter.redis.on('disconnect', () => {
      this.logger.warn('Redis connection is closed. Reconnecting...');
      this.initEmitter();
    });
  }
}
