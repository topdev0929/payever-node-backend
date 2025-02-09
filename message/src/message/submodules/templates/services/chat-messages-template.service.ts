import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import { InternalEventCodesEnum } from '../../../../common';
import {
  ChatMessageTemplateDocument,
  ChatMessageTemplateSchemaName,
} from '../schemas';
import { EventOriginEnum } from '../../../enums';

@Injectable()
export class ChatMessageTemplateService {
  constructor(
    @InjectModel(ChatMessageTemplateSchemaName)
      private readonly chatMessageTemplateModel: Model<ChatMessageTemplateDocument>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    data: Parameters<typeof this.chatMessageTemplateModel.create>[0],
    eventSource: EventOriginEnum,
  ): Promise<ChatMessageTemplateDocument> {
    const message: ChatMessageTemplateDocument = await this.chatMessageTemplateModel.create(data);

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageTemplateCreated, message, eventSource);

    return message;
  }

  public async findById(_id: string): Promise<ChatMessageTemplateDocument> {
    return this.chatMessageTemplateModel.findById(_id);
  }

  public find(
    filter: FilterQuery<ChatMessageTemplateDocument>,
  ): Query<ChatMessageTemplateDocument[], ChatMessageTemplateDocument> {
    return this.chatMessageTemplateModel.find({
      ...filter,
    });
  }

  public async update(
    data: Parameters<typeof this.chatMessageTemplateModel.findByIdAndUpdate>[0],
    eventSource: EventOriginEnum,
  ): Promise<ChatMessageTemplateDocument> {
    const updatedMessage: ChatMessageTemplateDocument =
      await this.chatMessageTemplateModel.findByIdAndUpdate(data._id, {
        ...data,
      }, {
        new: true,
      }).exec();

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.MessageTemplateUpdated, updatedMessage, eventSource);

    return updatedMessage;
  }

  public async delete(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<void> {

    const deletedMessage: ChatMessageTemplateDocument = await this.chatMessageTemplateModel.findOneAndDelete(
      {
        _id,
      },
    ).exec();
    if (!deletedMessage) {
      throw new NotFoundException(`ChatMessageTemplate message with _id "${_id}" not found`);
    }

    await this.eventDispatcher.dispatch(
      InternalEventCodesEnum.MessageTemplateDeleted,
      deletedMessage,
      eventSource,
    );
  }
}
