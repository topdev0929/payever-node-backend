import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMqClient, MessageBusService, MessageInterface } from '@pe/nest-kit';

import { IntegrationLinkDocument } from '../model';
import { IntegrationLinkSchemaName } from '../schemas';
import { AbstractMessaging, AbstractMessagingDocument, ChatInvitedMember } from '../../platform';
import { IntegrationLinkInterface } from '../interfaces';

@Injectable()
export class IntegrationLinkService {
  @Inject() private readonly rabbitMqClient: RabbitMqClient;
  @Inject() private readonly messageBusService: MessageBusService;
  constructor(
    @InjectModel(IntegrationLinkSchemaName)
    private readonly chatInviteModel: Model<IntegrationLinkDocument>,
    @InjectModel(AbstractMessaging.name)
    private readonly chatModel: Model<AbstractMessagingDocument>,
  ) { }

  public async create(
    data: IntegrationLinkInterface,
  ): Promise<IntegrationLinkDocument> {
    return this.chatInviteModel.create(data);
  }

  public async findById(_id: string): Promise<IntegrationLinkDocument> {
    return this.chatInviteModel.findById(_id);
  }

  public findOne(filter: FilterQuery<IntegrationLinkDocument>):
    Query<IntegrationLinkDocument, IntegrationLinkDocument> {
    return this.chatInviteModel.findOne(filter);
  }

  public async delete(
    _id: string,
  ): Promise<IntegrationLinkDocument> {
    const deletedChat: IntegrationLinkDocument = await this.chatInviteModel.findByIdAndDelete({
      _id,
    }).exec();

    return deletedChat;
  }

}
