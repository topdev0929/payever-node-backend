import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum, BusinessService } from '@pe/business-kit';
import { BusinessModelLocal } from '../../business';
import { IntegrationService, IntegrationSubscriptionService } from '../services';
import { EventDispatcher, EventListener } from '@pe/nest-kit/modules/event-dispatcher';
import { IntegrationSubscriptionEventsEnum } from '../enum';
import { FoldersEventsEnum, MappedFolderItemInterface } from '@pe/folders-plugin';
import { IntegrationSubscriptionEventProducer } from '../producer';
import { IntegrationSubscriptionModel } from '../models';
import { folderMapSubscriptionFn } from '../transformers';

@Injectable()
export class IntegrationSubscriptionListener {

  constructor(
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
    private readonly integrationSubscriptionEventProducer: IntegrationSubscriptionEventProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly businessService: BusinessService,
    private readonly integrationService: IntegrationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessModelLocal): Promise<void> {
    const subscriptions: IntegrationSubscriptionModel[] =
      await this.integrationSubscriptionService.findBusinessSubscriptions(business._id);
    for (const subscription of subscriptions) {
      await this.integrationSubscriptionService.remove(subscription);
    }
  }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async handleBusinessCreated(business: BusinessModelLocal): Promise<void> {
    const businessModel: any = await this.businessService.findOneById(business._id);
    await this.integrationService.processPendingInstallment(businessModel);
    await this.integrationSubscriptionService.initBusinessSubscriptions(business);

  }

  @EventListener(IntegrationSubscriptionEventsEnum.IntegrationSubscriptionCreated)
  public async handleIntegrationSubscriptionCreated(
    business: BusinessModelLocal,
    subscription: IntegrationSubscriptionModel,
    skipRmq: boolean = false,
  ): Promise<void> {
    await subscription.populate('integration').execPopulate();

    if (!skipRmq) {
      await this.integrationSubscriptionEventProducer.onCreate(business.id, subscription);
    }
    const mapped: MappedFolderItemInterface =
      await folderMapSubscriptionFn(subscription, { omitParentFolderId: false });
    if (!mapped) {
      return;
    }
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionCreateDocument,
      mapped,
    );
  }

  @EventListener(IntegrationSubscriptionEventsEnum.IntegrationSubscriptionUpdated)
  public async handleIntegrationSubscriptionUpdated(
    business: BusinessModelLocal,
    subscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    await subscription.populate('integration').execPopulate();

    await this.integrationSubscriptionEventProducer.onUpdate(business.id, subscription);
    const mapped: MappedFolderItemInterface =
      await folderMapSubscriptionFn(subscription, { omitParentFolderId: true });
    if (!mapped) {
      return;
    }
    await this.eventDispatcher.dispatch(
      FoldersEventsEnum.FolderActionUpdateDocument,
      mapped,
    );
  }

  @EventListener(IntegrationSubscriptionEventsEnum.IntegrationSubscriptionRemoved)
  public async handleIntegrationSubscriptionDeleted(
    business: BusinessModelLocal,
    subscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    await this.integrationSubscriptionEventProducer.onDelete(subscription._id);
    await this.eventDispatcher.dispatch(FoldersEventsEnum.FolderActionDeleteDocument, subscription._id);
  }
}
