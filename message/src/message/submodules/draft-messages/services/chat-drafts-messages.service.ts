import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';

import {
  ChatDraftMessage,
  ChatDraftMessageDocument,
} from '../schemas';

@Injectable()
export class ChatDraftsMessageService {
  constructor(
    @InjectModel(ChatDraftMessage.name)
    private readonly chatMessageDraftModel: Model<ChatDraftMessageDocument>,
  ) { }

  public async create(
    data: DocumentDefinition<ChatDraftMessageDocument>,
  ): Promise<ChatDraftMessageDocument> {

    return this.chatMessageDraftModel.create(data);
  }

  public async findById(_id: string): Promise<ChatDraftMessageDocument> {
    return this.chatMessageDraftModel.findById(_id);
  }

  public findOne(
    filter: FilterQuery<ChatDraftMessageDocument>,
  ): Query<ChatDraftMessageDocument, ChatDraftMessageDocument> {
    return this.chatMessageDraftModel.findOne(filter);
  }

  public find(
    filter: FilterQuery<ChatDraftMessageDocument>,
  ): Query<ChatDraftMessageDocument[], ChatDraftMessageDocument> {
    return this.chatMessageDraftModel.find(filter);
  }

  public async update(
    data: UpdateQuery<ChatDraftMessageDocument>,
  ): Promise<ChatDraftMessageDocument> {

    return this.chatMessageDraftModel.findByIdAndUpdate(data._id, {
      $set: data,
    }, {
      new: true,
    });
  }

  public async delete(
    _id: string,
  ): Promise<void> {
    await this.chatMessageDraftModel.findByIdAndDelete(_id, {
      new: true,
    }).exec();
  }

  public async deleteByFilter(
    filter: FilterQuery<ChatDraftMessageDocument>,
  ): Promise<void> {
    await this.chatMessageDraftModel.deleteMany(filter).exec();
  }
}
