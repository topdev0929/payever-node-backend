import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightService } from '../../../services';
import { ProductEventDto } from '../dto';
import { AppEnum } from '../../../enums';
import { SpotlightInterface } from '../../../interfaces';
import { ProductRabbitMessagesEnum } from '../enums';

@Controller()
export class ProductsMessageConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ProductRabbitMessagesEnum.ProductCreated,
  })
  public async onProductCreateEvent(data: ProductEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ProductRabbitMessagesEnum.ProductUpdated,
  })
  public async onProductUpdatedEvent(data: ProductEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ProductRabbitMessagesEnum.ProductDeleted,
  })
  public async onProductRemovedEvent(data: ProductEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.uuid,
    );
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ProductRabbitMessagesEnum.ProductExported,
  })
  public async onProductExportedEvent(data: ProductEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data, false);
    
  }

  private async createOrUpdateSpotlightFromEvent(data: ProductEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.productToSpotlightDocument(data), 
      data.uuid,
      index,
    );
  } 

  private productToSpotlightDocument(data: ProductEventDto): SpotlightInterface {

    return {
      app: AppEnum.Product,
      businessId: data.businessUuid,
      description: data.description,
      icon: data.imagesUrl && data.imagesUrl[0] || '',
      serviceEntityId: data.uuid,
      title: data.title,
    };
  }
}
