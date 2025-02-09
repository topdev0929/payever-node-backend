import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto } from '@pe/builder-theme-kit';
import { ConsumerService } from '@pe/builder-theme-kit/module/service';
import { OnPublishConsumerService } from '../services';
import { LogHelper } from '../../common/helpers';
import { AffiliatesMessagesProducer } from '../producers';
import { RabbitChannelsEnum } from '../../affiliates/enums';

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly consumerService: ConsumerService,
    private readonly affiliateMessagesProducer: AffiliatesMessagesProducer,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Affiliates,
    name: 'builder-affiliate.event.theme.published',
  })
  public async onBuilderThemePublishConsumer(dto: ApplicationThemePublishedDto): Promise<void> {
    LogHelper.timeLog('onBuilderThemePublishConsumer');
    const wsKey: string = dto.wsKey ? dto.wsKey : `publish:${dto.theme.id}-${dto.version}`;
    const process: any[] = [];
    let data: any;

    const on: any = this.consumerService.onBuilderThemePublished(dto);
    process.push(on);
    const dataPromise: any = this.onPublishConsumerService.publishData(
      dto.application.id, 
      dto.versionDiff.pageIds, 
      dto.version, 
      wsKey,
    );
    process.push(dataPromise);

    await Promise.all(process).then((values: any) => {
      data = values;
    });

    this.sendAffiliateMessage(dto, data, wsKey).catch();
    this.sendAffiliateMessageAllPages(dto, data, wsKey).catch();
  }

  private async sendAffiliateMessage(dto: ApplicationThemePublishedDto, data: any, wsKey: string): Promise<void> {
    await this.affiliateMessagesProducer.publishAffiliateData(
      wsKey,
      dto.applicationTheme,
    );
  }

  private async sendAffiliateMessageAllPages(
    dto: ApplicationThemePublishedDto, 
    data: any, 
    wsKey: string,
  ): Promise<void> {
    await this.affiliateMessagesProducer.publishAffiliateDataAllPages(
      data[1].domainNames,
      data[1].accessConfig,
      dto.application.id,
      wsKey,
    );
  }
}

