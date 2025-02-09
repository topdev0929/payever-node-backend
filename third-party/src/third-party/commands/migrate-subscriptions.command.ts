import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Positional, RabbitMqClient } from '@pe/nest-kit';
import {
  ConnectionModel,
  ConnectionSchemaName,
  IntegrationModel,
  IntegrationSchemaName,
  IntegrationSubscriptionModel,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { BusinessSchemaName } from '../../common/mongoose-schema.names';

@Injectable()
export class MigrateSubscriptionsCommand {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(IntegrationSchemaName) private readonly integrationModel: Model<IntegrationModel>,
    @InjectModel(IntegrationSubscriptionSchemaName) private readonly subModel: Model<IntegrationSubscriptionModel>,
    @InjectModel(ConnectionSchemaName) private readonly connectionModel: Model<ConnectionModel>,
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  @Command({
    command: 'migrate:subscriptions',
    describe: 'Migrate subscriptions with connections to dedicated TPM service.',
  })
  public async export(
    @Positional({ name: 'category' }) category: string,
    @Positional({ name: 'business' }) business_id: string,
  ): Promise<void> {
    const integrationCriteria: any = { };
    if (integrationCriteria) {
      integrationCriteria.category = category;
    }

    const businessCriteria: any = { };
    if (business_id) {
      businessCriteria._id = business_id;
    }

    const integrations: IntegrationModel[] = await this.integrationModel.find(integrationCriteria);

    const eventName: string = 'third-party.event.subscription.migrate';

    const total: number = await this.businessModel.countDocuments(businessCriteria);
    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const businesses: BusinessModel[] = await this.getWithLimit(processed, limit, businessCriteria);
      Logger.log(`Starting next ${businesses.length} businesses.`);
      for (const business of businesses) {
        const subscriptions: IntegrationSubscriptionModel[] = await this.subModel.find({
          business: business,
          integration: integrations.length ? { $in: integrations } : { $exists: true },
        })
          .populate('integration')
        ;

        if (!subscriptions.length) {
          continue;
        }

        const connections: ConnectionModel[] = await this.connectionModel.find({
          business: business,
          integration: integrations.length ? { $in: integrations } : { $exists: true },
        })
          .populate('integration')
        ;

        await this.rabbitMqClient.send(
          {
            channel: eventName,
            exchange: 'async_events',
          },
          {
            name: eventName,
            payload: {
              businessId: business.id,
              subscriptions: subscriptions.map(
                (subscription: IntegrationSubscriptionModel) => {
                  return {
                    category: subscription.integration.category,
                    name: subscription.integration.name,

                    actions: subscription.actions,
                  };
                },
              ),

              connections: connections.map(
                (connection: ConnectionModel) => {
                  return {
                    _id: connection._id,
                    authorizationId: connection.authorizationId,
                    name: connection.name,

                    integrationCategory: connection.integration.category,
                    integrationName: connection.integration.name,

                    actions: connection.actions,
                    connected: connection.connected,
                  };
                },
              ),
            },
          },
        );
      }

      processed += businesses.length;
    }

    Logger.log(`Compared ${processed} of ${total}.`);
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
