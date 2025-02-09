import { Injectable } from '@nestjs/common';
import { AddMemberMethodEnum, ChannelTypeEnum, EventOriginEnum } from '../enums';
import {
  CommonChannelDocument,
  CommonChannelService,
} from '../submodules/messaging/common-channels';
import { v4 as uuid } from 'uuid';

import {
  ChatMemberRoleEnum,
  MessagingIntegrationsEnum,
  MessagingTypeEnum,
} from '@pe/message-kit';
import { BusinessService } from '@pe/business-kit';
import { Encryption } from '@pe/nest-kit';

import {
  AbstractChatMessageDocument,
  ChatMessageService,
  CommonMessagingService,
} from '../submodules/platform';
import {
  ChatTextMessageDocument,
  EmailMessageInterface,
  EmailMessageResInterface,
} from '../interfaces';
import { LeanDocument } from 'mongoose';

@Injectable()
export class MailMessageService {
  constructor(
    private readonly commonMessagingService: CommonMessagingService,
    private readonly chatMessageService: ChatMessageService,
    private readonly businessService: BusinessService,
    private readonly commonChannelService: CommonChannelService,
  ) { }


  public async fetchedEmail(data: EmailMessageInterface): Promise<void> {
    const businessId: string = data.business.id;
    const emailAddress: string = data.email.from.address;
    const emailName: string = data.email.from.name;

    const emailChannel: CommonChannelDocument = await this.findByEmail(emailAddress, businessId);

    const businessData: any = await this.businessService.findOneById(
      businessId,
    );

    const newChannel = emailChannel
      ? {
        _id: emailChannel._id,
        salt: emailChannel.salt,
      }
      : await this.CreateEmailChannel(emailAddress, businessId, businessData.owner);

    const oldMessage: AbstractChatMessageDocument = await this.chatMessageService.findOne({
      emailId: data.email.messageId,
    });

    let replyTo;
    let replyToContent: string = '';
    if (data.email?.replayTo !== '') {
      replyTo = await this.chatMessageService.findOne({
        emailId: data.email.replayTo,
      });

      if (replyTo) {
        replyToContent = await this.chatMessageService.getReplyContent(replyTo);
      }
    }
    if (oldMessage) {
      return;
    }

    const textMessagePrototype: ChatTextMessageDocument & { replyToContent: string } = {
      _id: uuid(),
      attachments: [],
      chat: newChannel._id,
      content: await Encryption.encryptWithSalt(
        data.email.contentAsHtml,
        newChannel.salt,
      ),
      contentPayload: null,
      contentType: null,
      emailId: data.email.messageId,
      replyTo: replyTo ? replyTo._id : null,
      replyToContent: replyTo ? replyToContent || null : null,
      sender: `email-${emailAddress}[${emailName}]`,
      sentAt: new Date(data.email.date),
      type: 'text',
    };

    await this.chatMessageService.create(
      [textMessagePrototype],
      EventOriginEnum.MerchantChatServer,
    );
  }

  public async resSentEmail(data: EmailMessageResInterface): Promise<void> {

    if (!data.email.chatMessageId || !data.email.messageId) {

      return;
    }
    const ty = await this.chatMessageService.update({
      $set: {
        emailId: data.email.messageId,
      },
      _id: data.email.chatMessageId,
    }, EventOriginEnum.MerchantChatServer);
  }

  private CreateEmailChannel(emailAddress: string, businessId: string, owner: string) {
    return this.commonChannelService.create(
      {
        _id: uuid(),
        business: businessId,
        contacts: [],
        description: '',
        email: emailAddress,
        integrationName: MessagingIntegrationsEnum.Email,
        lastMessages: [],
        members: [
          {
            addMethod: AddMemberMethodEnum.OWNER,
            addedBy: owner,
            role: ChatMemberRoleEnum.Admin,
            user: owner,
          },
        ],
        permissions: {
          addMembers: true,
          change: true,
          live: false,
          pinMessages: true,
          sendMedia: true,
          sendMessages: true,
          showSender: true,
        } as LeanDocument<CommonChannelDocument['permissions']>,
        photo: '',
        salt: this.commonMessagingService.createSalt(),
        signed: false,
        subType: ChannelTypeEnum.Public,
        title: `Email - ${emailAddress}`,
        type: MessagingTypeEnum.Channel,
        usedInWidget: false,
      },
      EventOriginEnum.MerchantHttpServer,
    );
  }

  private async findByEmail(email: string, business: string): Promise<any> {
    return this.commonChannelService.findOne({
      business,
      deleted: false,
      email,
    });
  }
}
