import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';

import { MessagingTypeEnum } from '@pe/message-kit';
import { CustomerChatService } from '../../message/submodules/messaging/customer-chat';
import { CommonMessagingService } from '../../message/submodules/platform';
import { EventOriginEnum, RabbitChannelsEnum } from '../../message/enums';
import { TPMCustomerChatRMQIncomingDto } from '../dto';
import { StompTopicsEnum } from '../enums';
import { SocketIoEmitterService } from '../../message';
import * as createEmitter from 'socket.io-emitter';
import { WsOutgoingMessageEventCodeEnum } from '../../ws/enums';
import { UserOnlineStatusIncomeDto } from '../dto/user-online-status-income.dto';

/**
 * @description RMQ/STOMP combined controller/service
 */
@Injectable()
@Controller()
export class ThirdPartyMessengerChatsConsumer {
  constructor(
    private readonly customerChatsService: CustomerChatService,
    private readonly commonMessagingService: CommonMessagingService,
    private readonly socketIoEmitterService: SocketIoEmitterService,
  ) { }

  private get io(): ReturnType<typeof createEmitter> {
    return this.socketIoEmitterService.of('chat');
  }
  

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmChatCreated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmChatCreated,
  })
  public async onChatCreated(
    @Payload('json') dto: TPMCustomerChatRMQIncomingDto,
  ): Promise<void> {
    await this.customerChatsService.create(
      {
        lastMessages: [],
        members: [],
        ...dto,
        type: MessagingTypeEnum.CustomerChat,
      },
      EventOriginEnum.ThirdParty,
    );
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmChatUpdated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmChatUpdated,
  })
  public async onChatUpdated(
    @Payload('json') dto: TPMCustomerChatRMQIncomingDto,
  ): Promise<void> {
    await this.customerChatsService.update({
      ...dto,
      type: MessagingTypeEnum.CustomerChat,
    }, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmChatDeleted}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmChatDeleted,
  })
  public async onChatDeleted(
    @Payload('json') dto: TPMCustomerChatRMQIncomingDto,
  ): Promise<void> {
    await this.commonMessagingService.delete(dto._id, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmClientTyping}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmClientTyping,
  })
  public async onClientTyping(
    @Payload('json') dto: any,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(dto._id))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientChatTypingMembersUpdated, dto);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmUserOnlineRefresh}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmUserOnlineRefresh,
  })
  public async onOnlineUserStatus(
    @Payload('json') dto: UserOnlineStatusIncomeDto,
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(dto.businessId))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientOnlineUsers, { onlines: dto.onlines });
  }

}
