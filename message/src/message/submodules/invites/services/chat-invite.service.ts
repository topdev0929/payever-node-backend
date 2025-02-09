import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMqClient, MessageBusService, MessageInterface } from '@pe/nest-kit';

import { ChatInviteDocument } from '../model';
import { ChatInviteSchemaName } from '../schemas';
import { AbstractMessaging, AbstractMessagingDocument, ChatInvitedMember } from '../../platform';

@Injectable()
export class ChatInviteService {
  @Inject() private readonly rabbitMqClient: RabbitMqClient;
  @Inject() private readonly messageBusService: MessageBusService;
  constructor(
    @InjectModel(ChatInviteSchemaName)
    private readonly chatInviteModel: Model<ChatInviteDocument>,
    @InjectModel(AbstractMessaging.name)
    private readonly chatModel: Model<AbstractMessagingDocument>,
  ) { }

  public async create(
    data: DocumentDefinition<ChatInviteDocument>,
  ): Promise<ChatInviteDocument> {
    return this.chatInviteModel.create(data);
  }

  public async findById(_id: string): Promise<ChatInviteDocument> {
    return this.chatInviteModel.findById(_id);
  }

  public findOne(filter: FilterQuery<ChatInviteDocument>): Query<ChatInviteDocument, ChatInviteDocument> {
    return this.chatInviteModel.findOne(filter);
  }

  public find(filter: FilterQuery<ChatInviteDocument>): Query<ChatInviteDocument[], ChatInviteDocument> {
    return this.chatInviteModel.find(filter);
  }

  public async update(
    data: UpdateQuery<ChatInviteDocument>,
  ): Promise<ChatInviteDocument> {
    return this.chatInviteModel.findByIdAndUpdate(data._id, data, {
      new: true,
    });
  }

  public async delete(
    _id: string,
  ): Promise<ChatInviteDocument> {
    const deletedChat: ChatInviteDocument = await this.chatInviteModel.findByIdAndDelete({
      _id,
    }).exec();
    if (!deletedChat) {
      throw new NotFoundException(`ChatInvite with _id '${_id}' not found`);
    }

    return deletedChat;
  }

  public async sendInvitationByEmail(
    data: {
      business: { _id?: string };
      chat?: AbstractMessagingDocument;
      invitation?: { code?: string };
      user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        identifier?: string;
      };
    },
    email: string,
    template: string,
  ): Promise<void> {
    const chat: AbstractMessagingDocument = await this.chatModel.findById(data.chat?._id);

    const invitedMember: ChatInvitedMember =
      chat.invitedMembers?.find((member: ChatInvitedMember) => member.email === email);

    const emailMessage: MessageInterface = this.messageBusService.createMessage(
      'payever.event.mailer.send',
      {
        business: {
          uuid: data.business._id,
        },
        params: {
          addedBy: data.user.id,
          chat: {
            title: data.chat?.title,
          },
          invitation: {
            code: data.invitation?.code,
            invitedMember: invitedMember ? invitedMember._id : '',
          },
          locale: 'en',
          user: {
            email: data.user.email,
            firstName: data.user.firstName,
            identifier: data.user.identifier,
            lastName: data.user.lastName,
          },
        },
        to: email,
        type: template,
      },
    );

    await this.rabbitMqClient.send(
      {
        channel: 'payever.event.mailer.send',
        exchange: 'async_events',
      },
      emailMessage,
    );
  }
}
