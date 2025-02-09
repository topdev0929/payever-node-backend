import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';
import { ThirdPartyUserActivityDto } from '@pe/message-kit/modules/connect-app-sdk';
import { ChatTypingMembersService } from '../../message/submodules/platform';
import { EventOriginEnum, RabbitChannelsEnum } from '../../message/enums';
import { StompTopicsEnum } from '../enums';

/**
 * @description RMQ/STOMP combined controller/service
 */
@Injectable()
@Controller()
export class ThirdPartyMessengerUserActivityConsumer {
  constructor(
    private readonly chatTypingMembersService: ChatTypingMembersService,
  ) { }

  @Subscribe({
    prefetchCount: 1,
    queue: `/queue/${StompTopicsEnum.TpmUserActivity}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmUserActivity,
  })
  public async onUserActivity(
    @Payload('json') dto: ThirdPartyUserActivityDto,
  ): Promise<void> {
    if (dto.typingActivity) {
      await this.chatTypingMembersService.updateTypingMembers(
        dto.chatId,
        dto.contactId,
        null,
        dto.typingActivity.isTyping,
        EventOriginEnum.ThirdParty,
      );
    }
  }
}
