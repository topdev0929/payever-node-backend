import { Controller, Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Subscribe, Payload } from '@pe/stomp-client';

import { ContactsService } from '../../message/submodules/platform';
import { EventOriginEnum, RabbitChannelsEnum } from '../../message/enums';
import { StompTopicsEnum } from '../enums';
import { ContactStatusDto, TPMContactRMQIncomingDto } from '../dto';

/**
 * @description RMQ/STOMP combined controller/service
 */
 @Injectable()
 @Controller()
 export class ThirdPartyMessengerContactsConsumer {
   constructor(
     private readonly contactsService: ContactsService,
   ) { }

   @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmContactCreated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmContactCreated,
  })
  public async onContactCreated(
    @Payload('json') dto: TPMContactRMQIncomingDto,
  ): Promise<void> {
    await this.contactsService.updateOrCreate(dto, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmContactUpdated}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmContactUpdated,
  })
  public async onContactUpdated(
    @Payload('json') dto: TPMContactRMQIncomingDto,
  ): Promise<void> {
    await this.contactsService.update(dto, EventOriginEnum.ThirdParty);
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmContactDeleted}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmContactDeleted,
  })
  public async onContactDeleted(
    @Payload('json') dto: TPMContactRMQIncomingDto,
  ): Promise<void> {
    // do nothing
  }

  @Subscribe({
    queue: `/queue/${StompTopicsEnum.TpmContactStatus}`,
  })
  @MessagePattern({
    channel: RabbitChannelsEnum.Message,
    name: StompTopicsEnum.TpmContactStatus,
  })
  public async onContactStatus(
    @Payload('json') dto: ContactStatusDto,
  ): Promise<void> {
    await this.contactsService.setStatus(dto, EventOriginEnum.ThirdParty);
  }
}
