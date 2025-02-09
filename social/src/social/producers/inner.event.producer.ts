import { Injectable, Logger } from '@nestjs/common';
import { EventDispatcher, RabbitMqClient } from '@pe/nest-kit';
import { BusinessLocalModel } from '../../business/models';
import { BusinessLocalService } from '../../business';
import { PostRabbitEventsEnum, ThirdPartyActionEnum } from '../enums';
import { PostModel } from '../models';
import { FoldersEventsEnum } from '@pe/folders-plugin';
import { MappingHelper } from '../helpers';

@Injectable()
export class InnerEventProducer {
  constructor(
    private readonly businessService: BusinessLocalService,
    private readonly rabbitClient: RabbitMqClient,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async callIntegrationAction(
    business: BusinessLocalModel,
    action: ThirdPartyActionEnum,
    data: any = { },
  ): Promise<void> {

    business = await this.businessService.populateIntegrations(business);
    for (const integrationSubscription of business.integrationSubscriptions) {

      const payload: any = {
        action,
        business: {
          id: business.id,
        },
        data,
        integration: {
          name: integrationSubscription.integration.name,
        },
      };
      await this.rabbitClient.send(
        {
          channel: 'social.event.action.call',
          exchange: 'async_events',
        },
        {
          name: 'social.event.action.call',
          payload,
        },
      );

      this.logger.log({
        context: 'InnerEventProducer',
        message: 'SENT "social.event.action.call" event',
        payload,
      });
    }
  }

  public async triggerPostCreatedAction(
    business: BusinessLocalModel,
    data: PostModel,
  ): Promise<void> {
    await this.callIntegrationAction(
      business,
      ThirdPartyActionEnum.CreatePost,
      data,
    );

    const body: any = await MappingHelper.map(data);

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionCreateDocument, body);
    await this.send(PostRabbitEventsEnum.SocialPostCreated, data);
  }

  public async triggerPostUpdatedAction(
    business: BusinessLocalModel,
    data: PostModel,
  ): Promise<void> {
    await this.callIntegrationAction(
      business,
      ThirdPartyActionEnum.UpdatePost,
      data,
    );

    const body: any = await MappingHelper.map(data, { omitParentFolderId: true });

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionUpdateDocument, body);
    await this.send(PostRabbitEventsEnum.SocialPostUpdated, data);
  }

  public async triggerPostDeletedAction(
    business: BusinessLocalModel,
    data: PostModel,
  ): Promise<void> {
    await this.callIntegrationAction(
      business,
      ThirdPartyActionEnum.RemovePost,
      data,
    );

    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, data._id);
    await this.send(PostRabbitEventsEnum.SocialPostDeleted, data);
  }

  public async triggerPostExportedAction(
    data: PostModel,
  ): Promise<void> {
    await this.send(PostRabbitEventsEnum.SocialPostExported, data);
  }

  public async send(
    channel: string,
    data: any,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: channel,
        exchange: 'async_events',
      },
      {
        name: channel,
        payload: data,
      },
    );
  }
}
