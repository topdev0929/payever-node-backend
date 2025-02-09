import { Injectable, Inject } from '@nestjs/common';
import { AbstractMessagingDocument, ContactDocument, MessagingProducer, ChatMember } from '../submodules/platform';
import { ProducerInterface } from '../submodules/platform/interfaces/producer.interface';
import { EventOriginEnum, RMQEventsEnum } from '../enums';
import { RMQEventsProducer } from './rmq-events.producer';
import { UserDocument } from '../../projections';

@MessagingProducer()
@Injectable()
export class WidgetsDataProducer implements ProducerInterface {
  @Inject() protected readonly rabbitEventProducer: RMQEventsProducer;

  public canProduce(eventSource: EventOriginEnum): boolean {
    return true;
  }

  public async messagesUpdatedWithList(): Promise<void> { }

  public async messagesUpdated(): Promise<void> { }

  public async messagesDeleted(): Promise<void> { }
  
  public async messagesListDeleted(): Promise<void> { }

  public async messagesPosted(): Promise<void> { }

  public async chatCreated(chat: AbstractMessagingDocument): Promise<void> {
    await this.rabbitEventProducer.produceWidgetDataUpdatedEvent(chat, RMQEventsEnum.WidgetDataCreated);
  }

  public async chatUpdated(chat: AbstractMessagingDocument): Promise<void> {
    await this.rabbitEventProducer.produceWidgetDataUpdatedEvent(chat, RMQEventsEnum.WidgetDataUpdated);
  }

  public async chatDeleted(chat: AbstractMessagingDocument): Promise<void> {
    await this.rabbitEventProducer.produceWidgetDataUpdatedEvent(chat, RMQEventsEnum.WidgetDataDeleted);
  }

  public async chatMessagePinned(): Promise<void> { }

  public async chatMessageUnpinned(): Promise<void> { }

  public async memberIncluded(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    await this.rabbitEventProducer.produceWidgetMemberUpdatedEvent(
      chat,
      member,
      RMQEventsEnum.WidgetDataMemberIncluded,
    );
  }

  public async memberChanged(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    await this.rabbitEventProducer.produceWidgetMemberUpdatedEvent(
      chat,
      member,
      RMQEventsEnum.WidgetDataMemberChanged,
    );
  }

  public async memberExcluded(
    chat: AbstractMessagingDocument,
    user: UserDocument | null,
    member: ChatMember,
  ): Promise<void> {
    await this.rabbitEventProducer.produceWidgetMemberUpdatedEvent(
      chat,
      member,
      RMQEventsEnum.WidgetDataMemberExcluded,
    );
  }

  public async memberLeft(
    chat: AbstractMessagingDocument,
    user: UserDocument,
    member: ChatMember,
  ): Promise<void> {
    await this.memberExcluded(chat, user, member);
  }

  public async contactCreated(contact: ContactDocument): Promise<void> { }

  public async contactUpdated(contact: ContactDocument): Promise<void> {
    await this.rabbitEventProducer.produceWidgetDataForContactUpdate(contact, RMQEventsEnum.WidgetDataUpdated);
  }

  public async contactStatus(contact: ContactDocument): Promise<void> { }

  public async typingUpdated(): Promise<void> { }

  public async onlineMembersUpdated(): Promise<void> { }
}
