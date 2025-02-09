import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { ChatRabbitMessagesEnum } from '../enums';
import { AppEnum } from '../../../enums';
import { ChatEventDto } from '../dto';

@Controller()
export class ChatMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ChatRabbitMessagesEnum.WidgetDataCreated,
  })
  public async onChatCreated(data: ChatEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ChatRabbitMessagesEnum.WidgetDataUpdated,
  })
  public async onChatUpdated(data: ChatEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ChatRabbitMessagesEnum.WidgetDataExported,
  })
  public async onChatExport(data: ChatEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data, false);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: ChatRabbitMessagesEnum.WidgetDataDeleted,
  })
  public async onChatDeleted(data: ChatEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: ChatEventDto, index: boolean = true): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.chatToSpotlightDocument(data), 
      data.id,
      index,
    );
  } 

  private chatToSpotlightDocument(data: ChatEventDto): SpotlightInterface {

    return {
      app: AppEnum.Message,
      businessId: data.businessId,
      description: data.lastMessage?.content,
      icon: data.photo,
      salt: data.salt,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
