import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { PosRabbitMessagesEnum } from '../enums';
import { PosTerminalEventDto } from '../dto';
import { AppEnum } from '../../../enums';

@Controller()
export class PosMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: PosRabbitMessagesEnum.TerminalCreated,
  })
  public async onTerminalCreated(data: PosTerminalEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: PosRabbitMessagesEnum.TerminalUpdated,
  })
  public async onTerminalUpdated(data: PosTerminalEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: PosRabbitMessagesEnum.TerminalExport,
  })
  public async onTerminalExport(data: PosTerminalEventDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: PosRabbitMessagesEnum.TerminalRemoved,
  })
  public async onTerminalDeleted(data: PosTerminalEventDto): Promise<void> {
    await this.spotlightService.delete(
      data.id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: PosTerminalEventDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.chatToSpotlightDocument(data), 
      data.id,
    );
  } 

  private chatToSpotlightDocument(data: PosTerminalEventDto): SpotlightInterface {

    return {
      app: AppEnum.Pos,
      businessId: data.business.id,
      description: '',
      icon: data.logo,
      serviceEntityId: data.id,
      title: data.name,
    };
  }
}
