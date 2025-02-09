import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SiteService } from '../services';
import { SiteRabbitMessagesEnum } from '../enums';
import { SiteEventDto } from '../dto';

@Controller()
export class SiteMessagesConsumer {
  constructor(
    private readonly siteService: SiteService,
  ) { }

  @MessagePattern({
    name: SiteRabbitMessagesEnum.siteCreated,
  })
  public async onSiteCreated(data: SiteEventDto): Promise<void> {
    await this.siteService.createOrUpdateSiteFromEvent(data);
  }

  @MessagePattern({
    name: SiteRabbitMessagesEnum.siteUpdated,
  })
  public async onSiteUpdated(data: SiteEventDto): Promise<void> {
    await this.siteService.createOrUpdateSiteFromEvent(data);
  }

  @MessagePattern({
    name: SiteRabbitMessagesEnum.siteExport,
  })
  public async onSiteExport(data: SiteEventDto): Promise<void> {
    await this.siteService.createOrUpdateSiteFromEvent(data);
  }

  @MessagePattern({
    name: SiteRabbitMessagesEnum.siteRemoved,
  })
  public async onTerminalDeleted(data: SiteEventDto): Promise<void> {
    await this.siteService.deleteSite(data);
  }
}
