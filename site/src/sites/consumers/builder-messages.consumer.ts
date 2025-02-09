import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto } from '@pe/builder-theme-kit';
import { OnPublishConsumerService, SitesService } from '../services';
import { CompiledThemeService, ConsumerService } from '@pe/builder-theme-kit/module/service';
import { SiteMessagesProducer } from '../producers';
import { LinksMaskingIngressDto, PublishSiteDataPayloadDto } from '../dto';
import { RabbitChannelsEnum } from '../enums';

type DataType = [void, PublishSiteDataPayloadDto];

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly siteMessagesProducer: SiteMessagesProducer,
    private readonly sitesService: SitesService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Site,
    name: 'builder-site.links.masking.ingress',
  })
  public async onLinksMaskingIngress(dto: LinksMaskingIngressDto): Promise<void> {
    await this.sitesService.linksMaskingIngress(dto);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Site,
    name: 'builder-site.event.theme.published',
  })
  public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
    const wsKey: string = dto.wsKey ? dto.wsKey : `publish:${dto.theme.id}-${dto.version}`;

    const data: DataType = await Promise.all([
      this.consumerService.onBuilderThemePublished(dto),
      this.onPublishConsumerService.publishSiteData(dto.application.id, dto.version),
    ]);
    await this.sitesService.refreshThemeCache(dto.application.id);

    this.sendSiteMessage(dto, data, wsKey).catch();
  }

  private async sendSiteMessage(dto: ApplicationThemePublishedDto, data: DataType, wsKey: string): Promise<void> {
    await this.siteMessagesProducer.publishSiteData(
      wsKey,
      dto.applicationTheme,
    );
  }
}
