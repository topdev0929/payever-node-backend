import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApplicationThemePublishedDto } from '@pe/builder-theme-kit';
import { ConsumerService } from '@pe/builder-theme-kit/module/service';
import { OnPublishConsumerService } from '../services';
import { LogHelper } from '../../common/helpers';
import { SubscriptionsMessagesProducer } from '../producers';
import { RabbitChannelsEnum } from '../../environments';

@Controller()
export class BuilderMessagesConsumer {
  constructor(
    private readonly onPublishConsumerService: OnPublishConsumerService,
    private readonly consumerService: ConsumerService,
    private readonly subscriptionMessagesProducer: SubscriptionsMessagesProducer,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: 'builder-subscriptions.event.theme.published',
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
      dto.version,
      wsKey,
    );
    process.push(dataPromise);

    await Promise.all(process).then((values: any) => {
      data = values;
    });

    this.sendSubscriptionMessage(dto, data, wsKey).catch();
    this.sendSubscriptionMessageAllPages(dto, data, wsKey).catch();
  }

  private async sendSubscriptionMessage(dto: ApplicationThemePublishedDto, data: any, wsKey: string): Promise<void> {
    await this.subscriptionMessagesProducer.publishSubscriptionData(
      wsKey,
      dto.applicationTheme,
    );
  }

  private async sendSubscriptionMessageAllPages(
    dto: ApplicationThemePublishedDto,
    data: any,
    wsKey: string,
  ): Promise<void> {
    await this.subscriptionMessagesProducer.publishSubscriptionDataAllPages(
      data[1].domainNames,
      data[1].accessConfig,
      dto.application.id,
      wsKey,
    );
  }
}

