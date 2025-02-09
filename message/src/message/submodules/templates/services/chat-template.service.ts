import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { EventDispatcher } from '@pe/nest-kit';
import {
  ChatTemplateDocument,
  ChatTemplateSchemaName,
} from '../schemas';
import { InternalEventCodesEnum } from '../../../../common';
import { EventOriginEnum } from 'src/message/enums';

@Injectable()
export class ChatTemplateService {
  constructor(
    @InjectModel(ChatTemplateSchemaName)
      private readonly chatTemplateModel: Model<ChatTemplateDocument>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    data: DocumentDefinition<ChatTemplateDocument>,
    eventSource: EventOriginEnum,
  ): Promise<ChatTemplateDocument> {
    const chatTemplate: ChatTemplateDocument = await this.chatTemplateModel.create(data);

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ChatTemplateCreated, chatTemplate, eventSource);

    return chatTemplate;
  }

  public async findById(_id: string): Promise<ChatTemplateDocument> {
    return this.chatTemplateModel.findById(_id);
  }

  public findOne(filter: FilterQuery<ChatTemplateDocument>): Query<ChatTemplateDocument, ChatTemplateDocument> {
    return this.chatTemplateModel.findOne(filter);
  }

  public find(filter: FilterQuery<ChatTemplateDocument>): Query<ChatTemplateDocument[], ChatTemplateDocument> {
    return this.chatTemplateModel.find(filter);
  }

  public async update(
    data: UpdateQuery<ChatTemplateDocument>,
    eventSource: EventOriginEnum,
  ): Promise<ChatTemplateDocument> {
    const updatedChatTemplate: ChatTemplateDocument = await this.chatTemplateModel.findByIdAndUpdate(data._id, data, {
      new: true,
    }).exec();

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ChatTemplateUpdated, updatedChatTemplate, eventSource);

    return updatedChatTemplate;
  }

  public async delete(
    _id: string,
    eventSource: EventOriginEnum,
  ): Promise<ChatTemplateDocument> {
    const deletedChatTemplate: ChatTemplateDocument = await this.chatTemplateModel.findByIdAndDelete({
      _id,
    }).exec();
    if (!deletedChatTemplate) {
      throw new NotFoundException(`ChatTemplate with _id '${_id}' not found`);
    }

    await this.eventDispatcher.dispatch(InternalEventCodesEnum.ChatTemplateDeleted, deletedChatTemplate, eventSource);

    return deletedChatTemplate;
  }
}
