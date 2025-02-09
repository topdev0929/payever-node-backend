import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Positional } from '@pe/nest-kit';
import {
  ConnectionInterface,
  ConnectionModel,
  ConnectionSchemaName,
  IntegrationModel,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';
import { Model } from 'mongoose';

import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';

@Injectable()
export class ExportSubscriptionsToConnectionsCommand {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(IntegrationSubscriptionSchemaName) private readonly subModel: Model<IntegrationSubscriptionModel>,
    @InjectModel(ConnectionSchemaName) private readonly connectionModel: Model<ConnectionModel>,
  ) { }

  @Command({
    command: 'export:subscription:connection',
    describe: 'Export subscriptions to connections.',
  })
  public async export(
    @Positional({ name: 'business' }) business_id: string,
  ): Promise<void> {
    const criteria: any = { };
    if (business_id) {
      criteria._id = business_id;
    }

    const total: number = await this.businessModel.countDocuments(criteria);
    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const businesses: BusinessModel[] = await this.getWithLimit(processed, limit, criteria);
      Logger.log(`Starting next ${businesses.length} businesses.`);
      for (const business of businesses) {
        await business.populate('subscriptions').execPopulate();
        await business.populate('subscriptions.integration').execPopulate();
        for (const subscription of business.subscriptions) {
          await this.processSubscription(business, subscription.integration, subscription);
          await this.processConnection(business, subscription.integration, subscription);
        }
      }

      processed += businesses.length;
    }

    Logger.log(`Compared ${processed} of ${total}.`);
  }

  private async processSubscription(
    business: BusinessModel,
    integration: IntegrationModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    if (!integration) {
      await this.businessModel.updateOne(
        {
          _id: business.id,
        },
        {
          $pull: {
            subscriptions: subscription,
          },
        },
      );

      return;
    }

    await this.subModel.updateOne(
      {
        _id: subscription.id,
      },
      {
        business: business,
        integration: integration,
      },
    );
  }

  private async processConnection(
    business: BusinessModel,
    integration: IntegrationModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    if (!integration || !subscription.externalId || await this.connectionModel.findById(subscription.id)) {
      return;
    }

    const dto: ConnectionInterface & { _id: string } = {
      _id: subscription.id,
      business: business,
      integration: integration,

      actions: subscription.actions ? subscription.actions : [],
      authorizationId: subscription.externalId,
      connected: subscription.connected,
      name: '',
      options: { },
    };

    await this.connectionModel.create(dto as ConnectionModel);
  }

  private async getWithLimit(start: number, limit: number, criteria: any = { }): Promise<BusinessModel[]> {
    return this.businessModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
        sort: { _id: 1 },
      },
    );
  }
}
