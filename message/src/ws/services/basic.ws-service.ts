import { Server } from 'socket.io';
import { AbstractController } from '@pe/nest-kit';

import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ChatMessageWsResponseDto } from '../dto/outgoing';
import { WsOutgoingMessageEventCodeEnum } from '../enums';

export class BasicWsService extends AbstractController {
  constructor(
    protected readonly logger: Logger,
    protected readonly jwt: JwtService,
    protected chatGateway: {
      server: Server;
    },
  ) {
    super();
  }

  public async sendChatMessageToRoom(
    body: ChatMessageWsResponseDto,
  ): Promise<void> {
    this.chatGateway.server
      .to(body.chat)
      .emit(WsOutgoingMessageEventCodeEnum.WsClientMessagePosted, body);
  }

  public async withdrawChatMessageFromRoom(
    body: ChatMessageWsResponseDto,
    reason: any,
  ): Promise<void> {
    this.chatGateway.server
      .to(body.chat)
      .emit(WsOutgoingMessageEventCodeEnum.WsClientMessageWithdrawed, body, reason);
  }
}
