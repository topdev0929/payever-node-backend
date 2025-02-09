import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';
import { MessagingTypeEnum } from '@pe/message-kit';

import { CustomerChatService } from '../../message/submodules/messaging/customer-chat';
import { ThirdPartyMessengerContactsConsumer } from './tpm-contacts.consumer';
import { ThirdPartyMessengerMessagesConsumer } from './tpm-messages.consumer';
import { StompTopicsEnum } from '../enums';
import { RabbitChannelsEnum } from '../../message';
import { FirstMessageDto } from '../dto';

@Injectable()
@Controller()
export class ThirdPartyMessengerFirstMessageConsumer {
  constructor(
    private readonly thirdPartyMessengerMessagesConsumer: ThirdPartyMessengerMessagesConsumer,
    private readonly customerChatsService: CustomerChatService,
    private readonly thirdPartyMessengerContactsConsumer: ThirdPartyMessengerContactsConsumer,
  ) { }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmFirstMessageCreated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmFirstMessageCreated,
  })
  public async onFirstChatMessageCreated(
    @Payload('json') dto: FirstMessageDto,
  ): Promise<void> {
    if (dto.contact) {
      await this.thirdPartyMessengerContactsConsumer.onContactCreated(dto.contact);
    }


    if (dto.chat) {
      const chatExist: boolean = await this.customerChatsService.exists({ _id: dto.chat._id });
      if (!chatExist) {
        await this.customerChatsService.create({
          lastMessages: [],
          members: [],
          ...dto.chat,
          type: MessagingTypeEnum.CustomerChat,
        }, null);
      }      
    }

    if (dto.message) {
      (dto.message as any).isFirstMessage = true;
      dto.message.businessId = dto.message.businessId || dto.chat?.business || dto.contact?.business;
      await this.thirdPartyMessengerMessagesConsumer.onChatMessageCreated(dto.message);
    }
  }
}
