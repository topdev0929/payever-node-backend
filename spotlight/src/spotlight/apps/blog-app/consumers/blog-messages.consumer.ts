import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { BlogRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { BlogEventDto } from '../dto';

@Controller()
export class BlogMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: BlogRabbitEventsEnum.BlogCreated,
  })
  public async onBlogCreated(data: BlogEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: BlogRabbitEventsEnum.BlogUpdated,
  })
  public async onBlogUpdated(data: BlogEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: BlogRabbitEventsEnum.BlogExported,
  })
  public async onBlogExport(data: BlogEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: BlogRabbitEventsEnum.BlogRemoved,
  })
  public async onBlogDeleted(data: BlogEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: BlogEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.blogToSpotlightDocument(data), 
      data.id,
    );
  } 

  private blogToSpotlightDocument(data: BlogEventDto): SpotlightInterface {

    return {
      app: AppEnum.Blog,
      businessId: data.business.id,
      description: '',
      icon: data.picture,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
