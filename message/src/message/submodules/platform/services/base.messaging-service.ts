import { Inject, BadRequestException } from '@nestjs/common';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery } from 'mongoose';
import { EventDispatcher } from '@pe/nest-kit';

import { EventOriginEnum } from '../../../enums';

import {
  GetMessagingFilterContextInterface,
  GetMessagingMembersFilterContextInterface,
  ChatCreatedExtraDataInterface,
} from '../../../interfaces';
import { AbstractChatMessageEmbeddedDocument, AbstractMessaging, AbstractMessagingDocument } from '../schemas';
import { UserDocument } from '../../../../projections/models';
import { MessagingIntegrationsEnum, MessagingTypeEnum } from '@pe/message-kit';
import { ChannelEventProducer } from '../producers/channel-event.producer';

export abstract class BaseMessagingService<T extends AbstractMessagingDocument> {
  @Inject() protected readonly eventDispatcher: EventDispatcher;
  @Inject() protected readonly channelEventProducer: ChannelEventProducer;

  constructor(
    protected readonly model: Model<T>,
    protected readonly eventCodes: {
      created: string;
      updated: string;
      deleted: string;
    },
  ) { }

  public async create(
    data: DocumentDefinition<T>,
    eventSource: EventOriginEnum,
  ): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/dot-notation
    const integrationName: MessagingIntegrationsEnum = data['integrationName'];
    const messagingType: MessagingTypeEnum = data.type as MessagingTypeEnum;
    if (Array.isArray(this.allowedIntegrations) && !this.allowedIntegrations.includes(integrationName)) {
      throw new BadRequestException(`Integration "${integrationName}" not allowed for "${messagingType}"`);
    }
    // remove lastMessages before inserting to prevent insert duplicated messages
    const lastMessage = data.lastMessages;
    delete data.lastMessages;

    const chat: T = await this.model.create(data);
    await chat.populate('contact').execPopulate();

    const createMessagingEventData: ChatCreatedExtraDataInterface<T> = {
      prototype: data,
    };
    chat.lastMessages = lastMessage as AbstractChatMessageEmbeddedDocument[];

    await this.eventDispatcher.dispatch(
      this.eventCodes.created,
      chat,
      eventSource,
      createMessagingEventData,
    );

    await this.channelEventProducer.produceChannelCreationEvent(chat);

    return chat;
  }

  public async findById(_id: string): Promise<T> {
    return this.model.findById(_id);
  }

  public async exists(filter: FilterQuery<T>): Promise<boolean> {
    return this.model.exists(filter);
  }

  public async findOne(filter: FilterQuery<T>): Promise<T> {
    return this.model.findOne(filter);
  }

  public async find(filter: FilterQuery<T>): Promise<T[]> {
    return this.model.find(filter);
  }

  public async findAndPopulate(filter: FilterQuery<T>, population: string): Promise<T[]> {
    return this.model.find(filter).populate(population);
  }

  public async update(
    data: UpdateQuery<T>,
    eventSource: EventOriginEnum,
  ): Promise<T> {
    const updatedChat: T = await this.model.findByIdAndUpdate(data._id, data, {
      new: true,
    }).exec();

    await this.eventDispatcher.dispatch(
      this.eventCodes.updated,
      updatedChat,
      eventSource,
    );

    return updatedChat;
  }

  public async updateOrCreate(
    query: FilterQuery<T>,
    updateData: UpdateQuery<T>,
    upsertData: DocumentDefinition<T>,
    eventSource: EventOriginEnum,
  ): Promise<T> {
    const existing: T = await this.findOne(query);

    return existing ? this.update({
      ...updateData,
      _id: existing._id,
      type: existing.type,
    }, eventSource) : this.create(upsertData, eventSource);
  }

  public abstract isServiceOf(chat: AbstractMessaging): boolean;
  public abstract getMessagingFilter(context: GetMessagingFilterContextInterface): FilterQuery<T>;
  public abstract getMembersFilter(context: GetMessagingMembersFilterContextInterface): FilterQuery<UserDocument>;
  protected abstract allowedIntegrations: MessagingIntegrationsEnum[];
}
