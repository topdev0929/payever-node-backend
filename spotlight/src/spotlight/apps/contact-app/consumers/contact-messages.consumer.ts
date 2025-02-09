import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { AppEnum } from '../../../enums';
import { ContactRabbitEventsEnum } from '../enums';
import { ContactEventDto } from '../dto';

@Controller()
export class ContactMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ContactRabbitEventsEnum.ContactCreated,
  })
  public async onContactCreated(data: ContactEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ContactRabbitEventsEnum.ContactUpdated,
  })
  public async onContactUpdated(data: ContactEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ContactRabbitEventsEnum.ContactExported,
  })
  public async onContactExport(data: ContactEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ContactRabbitEventsEnum.ContactRemoved,
  })
  public async onContactDeleted(data: ContactEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.contact._id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ContactEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.contactToSpotlightDocument(data), 
      data.contact._id,
    );
  } 

  private contactToSpotlightDocument(data: ContactEventDto): SpotlightInterface {
    const contactFields: any = { };

    for (const field of data.contact.fields) {
      contactFields[field.field.name] = field.value;
    }

    contactFields.fullName = `${contactFields.firstName || ''} ${contactFields.lastName || ''}`;

    return {
      app: AppEnum.Contact,
      businessId: data.contact.businessId,
      description: contactFields.email,
      icon: '',
      payload: {
        email: contactFields.email,
      },
      serviceEntityId: data.contact._id,
      title: contactFields.fullName,
    };
  }
}
