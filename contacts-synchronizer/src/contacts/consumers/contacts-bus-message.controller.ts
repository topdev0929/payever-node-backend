import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import {
  ContactsSynchronizationIncomingEventMessageDto,
  ContactIncomingEventMessageDto,
  ContactSynchronizationFailedDto,
} from '../dto/incoming';
import { ConsumerHandlerService } from '../services';
import { ContactsIncomingSynchronizationEventsEnum, ContactsIncomingEventsEnum } from '../enums';

@Controller()
export class ContactsBusMessageController {
  constructor(
    private readonly consumerHandlerService: ConsumerHandlerService,
  ) { }

  @MessagePattern({
    name: ContactsIncomingEventsEnum.Created,
  })
  public async onContactCreated(dto: ContactIncomingEventMessageDto): Promise<void> {
    await this.consumerHandlerService.handleOnContactCreatedEvent(dto);
  }

  @MessagePattern({
    name: ContactsIncomingEventsEnum.Updated,
  })
  public async onContactUpdated(dto: ContactIncomingEventMessageDto): Promise<void> {
    await this.consumerHandlerService.handleOnContactUpdatedEvent(dto);
  }

  @MessagePattern({
    name: ContactsIncomingEventsEnum.Removed,
  })
  public async onContactRemoved(dto: ContactIncomingEventMessageDto): Promise<void> {
    await this.consumerHandlerService.handleOnContactRemovedEvent(dto);
  }

  @MessagePattern({
    name: ContactsIncomingSynchronizationEventsEnum.Created,
  })
  public async onSyncContactCreated(dto: ContactsSynchronizationIncomingEventMessageDto): Promise<void> {
    await this.consumerHandlerService.handleOnSyncContactCreated(dto);
  }

  @MessagePattern({
    name: ContactsIncomingSynchronizationEventsEnum.Updated,
  })
  public async onSyncContactUpdated(dto: ContactsSynchronizationIncomingEventMessageDto): Promise<void> {
    await this.consumerHandlerService.handleOnSyncContactUpdated(dto);
  }

  @MessagePattern({
    name: ContactsIncomingSynchronizationEventsEnum.Failed,
  })
  public async onSyncContactFailed(dto: ContactSynchronizationFailedDto): Promise<void> {
    await this.consumerHandlerService.handleOnSyncContactFailed(dto);
  }
}
