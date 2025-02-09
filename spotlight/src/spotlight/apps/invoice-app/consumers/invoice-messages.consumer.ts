import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { InvoiceRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { InvoiceEventDto } from '../dto';

@Controller()
export class InvoiceMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: InvoiceRabbitEventsEnum.InvoiceCreated,
  })
  public async onInvoiceCreated(data: InvoiceEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: InvoiceRabbitEventsEnum.InvoiceUpdated,
  })
  public async onInvoiceUpdated(data: InvoiceEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: InvoiceRabbitEventsEnum.InvoiceExported,
  })
  public async onInvoiceExport(data: InvoiceEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: InvoiceRabbitEventsEnum.InvoiceRemoved,
  })
  public async onInvoiceDeleted(data: InvoiceEventDto): Promise<void> {
    await this.spotlightService.delete(
      data._id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: InvoiceEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.invoiceToSpotlightDocument(data), 
      data._id,
    );
  } 

  private invoiceToSpotlightDocument(data: InvoiceEventDto): SpotlightInterface {
    return {
      app: AppEnum.Invoice,
      businessId: data.businessId,
      description: data.status,
      icon: '',
      payload: {
        customer: data.customer?.name,
        invoiceId: data.invoiceId,
      },
      serviceEntityId: data._id,
      title: data.invoiceId,
    };
  }
}
