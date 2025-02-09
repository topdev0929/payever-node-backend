import { Inject, Injectable, Logger } from '@nestjs/common';
import * as createEmitter from 'socket.io-emitter';
import { WsOutgoingMessageEventCodeEnum } from '../../ws/enums';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { EventOriginEnum } from '../enums';
import {
  AbstractMessagingDocument,
  ContactDocument,
  AbstractChatMessage,
  AbstractChatMessageDocument,
  CommonMessagingService,
  AbstractMessaging,
  MessagingProducer,
} from '../submodules/platform';
import { AppChannelDocument } from '../submodules/messaging/app-channels';
import { ChatOnlineMemberInterface } from '../schemas';
import { RedisClient } from '@pe/nest-kit';

@MessagingProducer()
@Injectable()
export class WsWidgetProducer implements ProducerInterface {
  private io: ReturnType<typeof createEmitter>;
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly clientRedis: RedisClient,
    private readonly logger: Logger,
  ) {
    this.initEmitter();
  }

  public async messagesUpdatedWithList(): Promise<void> { }

  public canProduce(eventSource: EventOriginEnum): boolean {
    return true;
  }

  public async contactCreated(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactCreated, contact);
  }

  public async contactUpdated(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactUpdated, contact);
  }

  public async contactStatus(contact: ContactDocument): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(contact.business))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientContactStatus, contact);
  }

  public async memberIncluded(): Promise<void> { }

  public async memberChanged(): Promise<void> { }

  public async memberExcluded(): Promise<void> { }

  public async memberLeft(): Promise<void> { }

  public async chatCreated(chat: AbstractMessagingDocument): Promise<void> {
    if (AbstractMessaging.hasBusiness(chat)) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatCreated, chat);
    }
  }

  public async chatUpdated(chat: AbstractMessagingDocument): Promise<void> {
    if (AbstractMessaging.hasBusiness(chat)) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatUpdated, chat);
    }
  }

  public async chatDeleted(chat: AbstractMessagingDocument): Promise<void> {
    if (AbstractMessaging.hasBusiness(chat)) {
      this.io
        .to(this.commonMessagingService.getRoomIdByBusinessId(chat.business))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientChatDeleted, chat);
    }
  }

  public async chatMessagePinned(): Promise<void> { }

  public async chatMessageUnpinned(): Promise<void> { }

  public async messagesUpdated(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(message.chat))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessageUpdated, await this.decryptMessage(message, chat.salt));
    }
  }

  public async messagesDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      this.io
        .to(this.commonMessagingService.getRoomIdByChatId(message.chat))
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessageDeleted, await this.decryptMessage(message, chat.salt));
    }
  }

  public async messagesListDeleted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {

    const messagesDecrypt: AbstractChatMessage[] = await Promise.all(
      messages.map((message: AbstractChatMessageDocument) => this.decryptMessage(message, chat.salt)),
    );
    this.io
      .to(this.commonMessagingService.getRoomIdByChatId(messages[0].chat))
      .emit(
        WsOutgoingMessageEventCodeEnum.WsClientMessageDeleted,
        messagesDecrypt,
      );
  }

  public async messagesPosted(
    messages: AbstractChatMessageDocument[],
    chat: AbstractMessagingDocument,
  ): Promise<void> {
    for (const message of messages) {
      const roomId: string = this.commonMessagingService.getRoomIdByChatId(message.chat);
      this.io
        .to(roomId)
        .emit(WsOutgoingMessageEventCodeEnum.WsClientMessagePosted, await this.decryptMessage(message, chat.salt));
    }
  }

  public async initialAppChannelsCreated(
    businessId: string,
    appChannels: AppChannelDocument[],
  ): Promise<void> {
    this.io
      .to(this.commonMessagingService.getRoomIdByBusinessId(businessId))
      .emit(WsOutgoingMessageEventCodeEnum.WsClientInitialAppChannelsCreated, {
        channels: appChannels,
      });
  }

  public async typingUpdated(
    chat: AbstractMessagingDocument,
    member: ChatOnlineMemberInterface,
    isTyping: boolean,
    typingMembers: ChatOnlineMemberInterface[],
  ): Promise<void> { }

  public async onlineMembersUpdated(
    chat: AbstractMessagingDocument,
    onlineMembers: ChatOnlineMemberInterface[],
    onlineMembersCount: number,
  ): Promise<void> { }

  private initEmitter(): void {
    const emitter = createEmitter(this.clientRedis.getClient().duplicate());
    this.io = emitter.of('widget');

    emitter.redis.on('error', (err: any) => {
      this.logger.error(err);
      this.initEmitter();
    });

    emitter.redis.on('disconnect', () => {
      this.logger.warn('Redis connection is closed. Reconnecting...');
      this.initEmitter();
    });
  }

  private async decryptMessage(message: AbstractChatMessageDocument, salt: string): Promise<AbstractChatMessage> {
    return this.commonMessagingService.decryptMessage(message, salt);
  }
}
