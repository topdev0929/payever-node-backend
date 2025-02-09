import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { SocialRabbitEventsEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { SocialEventDto } from '../dto';

@Controller()
export class SocialMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SocialRabbitEventsEnum.SocialCreated,
  })
  public async onSocialCreated(data: SocialEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SocialRabbitEventsEnum.SocialUpdated,
  })
  public async onSocialUpdated(data: SocialEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SocialRabbitEventsEnum.SocialExported,
  })
  public async onSocialExport(data: SocialEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: SocialRabbitEventsEnum.SocialRemoved,
  })
  public async onSocialDeleted(data: SocialEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: SocialEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.socialToSpotlightDocument(data), 
      data.id,
    );
  } 

  private socialToSpotlightDocument(data: SocialEventDto): SpotlightInterface {

    return {
      app: AppEnum.Social,
      businessId: data.businessId,
      description: data.content,
      icon: null,
      serviceEntityId: data.id,
      title: data.title,
    };
  }
}
