import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SiteRabbitMessagesEnum } from '../enums';
import { SiteService } from '../services';
import { CreateSiteDto, RemoveSiteDto } from '../dto';
import { DomainUpdateDto } from '../dto/domain-update.dto';
import { SetDefaultSiteDto } from '../dto/set-default-site.dto';
import { MessageBusChannelsEnum } from '../../environments/rabbitmq';

@Controller()
export class SiteMessagesConsumer {
  constructor(
    private readonly siteService: SiteService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.SiteCreated,
  })
  public async onSiteCreateEvent(dto: CreateSiteDto): Promise<void> {
    await this.siteService.create(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.SiteRemoved,
  })
  public async onSiteRemoveEvent(dto: RemoveSiteDto): Promise<void> {
    await this.siteService.removeById(dto.id);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.SiteUpdated,
  })
  public async onSiteUpdateEvent(dto: CreateSiteDto): Promise<void> {
    await this.siteService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.SiteExport,
  })
  public async onSiteExportEvent(dto: CreateSiteDto): Promise<void> {
    await this.siteService.upsert(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.DomainUpdated,
  })
  public async onSiteDomainUpdated(dto: DomainUpdateDto): Promise<void> {
    await this.siteService.updateDomain(dto);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.statistics,
    name: SiteRabbitMessagesEnum.SetDefaultSite,
  })
  public async onSetDefaultTerminal(dto: SetDefaultSiteDto): Promise<void> {
    await this.siteService.setDefaultSite(dto);
  }
}
