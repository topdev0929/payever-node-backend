import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqClient, RabbitMqRPCClient } from '@pe/nest-kit';
import { ApplicationThemeDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';

import { SubscriptionNetworkModel } from '../models';
import { SubscriptionNetworkRabbitMessagesEnum } from '../enums';

import { AppWithAccessConfigDto } from '../dto';

@Injectable()
export class SubscriptionsMessagesProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly rabbitMqRPCClient: RabbitMqRPCClient,
    private readonly logger: Logger,
  ) { }

  public async produceSubscriptionNetworkEvent(
    eventName: SubscriptionNetworkRabbitMessagesEnum,
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...subscriptionNetwork,
          business: {
            id: subscriptionNetwork.business,
          },
          id: subscriptionNetwork._id || subscriptionNetwork.id,
        },
      },
    );
  }

  public async produceRpcSubscriptionNetworkMessage(
    eventName: SubscriptionNetworkRabbitMessagesEnum,
    subscriptionNetwork: SubscriptionNetworkModel,
  ): Promise<void> {
    if (!subscriptionNetwork) {
      return;
    }

    await this.rabbitMqRPCClient.send(
      {
        channel: eventName,
        exchange: 'async_events',
      },
      {
        name: eventName,
        payload: {
          ...subscriptionNetwork,
          business: {
            id: subscriptionNetwork.business,
          },
          id: subscriptionNetwork._id || subscriptionNetwork.id,
        },
      },
      {
        responseType: 'json',
      },
    ).catch((error: any) => {
      this.logger.error(
        {
          error: error.message,
          message: 'Failed subscription RPC call',
          routingKey: eventName,
        },
        error.stack,
        'SubscriptionsMessagesProducer',
      );
    });
  }


  public async publishSubscriptionData(
    wsKey: string,
    applicationTheme: ApplicationThemeDto,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: SubscriptionNetworkRabbitMessagesEnum.SubscriptionThemePublished,
        exchange: 'async_events',
      },
      {
        name: SubscriptionNetworkRabbitMessagesEnum.SubscriptionThemePublished,
        payload: {
          applicationTheme: applicationTheme,
          wsKey: wsKey,
        },
      },
    );
  }

  public async publishSubscriptionDataAllPages(
    domainNames: string[],
    accessConfig: AppWithAccessConfigDto,
    applicationId: string,
    wsKey: string,
  ): Promise<void> {
    const compiledTheme: CompiledThemeWithPagesInterface
      = await this.compiledThemeService.getCompiledThemeWithContentLessPages(applicationId);
    await this.rabbitClient.send(
      {
        channel: SubscriptionNetworkRabbitMessagesEnum.SubscriptionThemePublishedAllPages,
        exchange: 'async_events',
      },
      {
        name: SubscriptionNetworkRabbitMessagesEnum.SubscriptionThemePublishedAllPages,
        payload: {
          app: accessConfig,
          domains: domainNames,
          theme: compiledTheme,
          wsKey: wsKey,
        },
      },
    );
  }
}
