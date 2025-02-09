import * as msgpack from 'notepack.io';
import { Inject, OnModuleInit, forwardRef } from '@nestjs/common';
import { WsOutgoingMessageEventCodeEnum } from '../enums';
import { WsService } from '../services';
import { MsgpackDecodeResult, Payload } from '../interfaces/ws-subscribe-payload.interface';
import { RedisClient } from '@pe/nest-kit';

export class RedisConsumer implements OnModuleInit {
  constructor(
    private readonly clientRedis: RedisClient,
    @Inject(forwardRef(() => WsService)) private wsService: WsService,
  ) { }

  public onModuleInit(): void {
    const subscriber = this.clientRedis.getClient();
    subscriber.on('pmessage_buffer', (pattern: string, channel: string, buffer: Buffer) => {
      const [, payload]: MsgpackDecodeResult = msgpack.decode(buffer);
      const [event, arg1]: Payload = payload.data;
      if (arg1 && event === WsOutgoingMessageEventCodeEnum.WsClientMemberExcludedFromChat) {
        const chatId: string = (arg1 as any).chatId;
        const userId: string = (arg1 as any).user?._id;
        setTimeout(() => {
          this.wsService.handleExcludedMemberSockets(chatId, userId, null);
        }, 1000);
      }
    });
    subscriber.psubscribe('socket.io#/chat#*');
  }
}
