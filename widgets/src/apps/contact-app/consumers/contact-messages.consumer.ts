import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ContactService } from '../services';
import { ContactRabbitMessagesEnum } from '../enums';
import { ContactEventDto } from '../dto';
import { MessageBusChannelsEnum } from '../../../common';

@Controller()
export class ContactMessagesConsumer {
  constructor(
    private readonly contactService: ContactService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.widgets,
    name: ContactRabbitMessagesEnum.contactCreated,
  })
  public async onContactCreated(data: ContactEventDto): Promise<void> {
    await this.contactService.createOrUpdateContactFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.widgets,
    name: ContactRabbitMessagesEnum.contactUpdated,
  })
  public async onContactUpdated(data: ContactEventDto): Promise<void> {
    await this.contactService.createOrUpdateContactFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.widgets,
    name: ContactRabbitMessagesEnum.contactExported,
  })
  public async onContactExport(data: ContactEventDto): Promise<void> {
    await this.contactService.createOrUpdateContactFromEvent(data);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.widgets,
    name: ContactRabbitMessagesEnum.contactRemoved,
  })
  public async onTerminalDeleted(data: ContactEventDto): Promise<void> {
    await this.contactService.deleteContact(data);
  }
}
