import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional, Option } from '@pe/nest-kit';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { IntegrationSubscriptionModel, IntegrationModel } from '../models';
import { EventProducer, IntegrationSubscriptionEventProducer } from '../producer';
import { IntegrationSubscriptionService } from '../services';
import { BusinessModelLocal } from '../../business';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { BusinessSchemaName } from '@pe/business-kit';

export const BATCH_SIZE: number = 1000;
export const DEFAULT_CATEGORY: string = 'products';

@Injectable()
export class ExportIntegrationSubscriptions {

  constructor(
    private readonly logger: Logger,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly eventProducer: EventProducer,
    private readonly integrationSubscriptionEventProducer: IntegrationSubscriptionEventProducer,
    @InjectModel('Integration')
    private readonly integrationModel: Model<IntegrationModel>,
    @InjectModel(BusinessSchemaName)
    private readonly businessModel: Model<BusinessModelLocal>,
  ) { }

  @Command({
    command: 'export:integration-subscriptions-products',
    describe: 'Export integration subscriptions to products through bus',
  })
  public async exportToProduct(
    @Positional({
      name: 'category',
    }) category: string,
  ): Promise<void> {
    this.logger.log('Exporting integration subscriptions to product started');
    if (!category) {
      category = DEFAULT_CATEGORY;
    }

    await this.subscriptionService
      .findAllByCategory(category, BATCH_SIZE)
      .pipe(
        filter((model: IntegrationSubscriptionModel) => !!(model.integration)),
        mergeMap((model: IntegrationSubscriptionModel) => from(this.findBusinessAndProduce(model)), BATCH_SIZE),
      )
      .toPromise();
    this.logger.log('Exporting integration subscriptions to product finished');
  }

  @Command({
    command: 'export:integration-subscriptions [--after]',
    describe: 'Export integration subscriptions bus',
  })
  public async export(
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    this.logger.log('Exporting integration subscriptions started');
    const criteria: FilterQuery<IntegrationSubscriptionModel> = { };

    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    await this.subscriptionService
      .findAllByCriteria(BATCH_SIZE, criteria)
      .pipe(
        mergeMap((model: IntegrationSubscriptionModel) => from(this.findBusinessAndExport(model)), BATCH_SIZE),
      )
      .toPromise();
    this.logger.log('Exporting integration subscriptions finished');
  }

  @Command({
    command: 'export:rebuild-folder-item-locations',
    describe: 'Export rebuild folders',
  })
  public async rebuildFolders(
    @Positional({
      name: 'businessId',
    }) businessId?: string
  ): Promise<void> {
    if (businessId) {
      this.logger.log(`Syncing folder item locations started for businessId: ${businessId}`);
      await this.eventProducer.syncIntegrations([businessId]);
    } else {
      const batchSize: number = 100;
      const cursor = this.businessModel.find().cursor({ batchSize });
      let number = 0;
      let businesses: string[] = [];
      for await (const business of cursor) {
        this.logger.log(`Syncing folder item locations for #${number++} businessId: ${business._id}`);
        businesses.push(business._id);
        if (businesses.length === batchSize) {
          await this.eventProducer.syncIntegrations(businesses);
          businesses = [];
        }
      }
      await this.eventProducer.syncIntegrations(businesses);
    }
    this.logger.log('Syncing folder item locations finished');
  }

  @Command({
    command: 'export:integration-subscriptions:by-name',
    describe: 'Export integration subscriptions by integration name',
  })
  public async exportByIntegrationName(
    @Positional({
      name: 'integration_name',
    }) integrationName: string,
    @Positional({
      name: 'batch',
    }) batch: string,
    @Positional({
      name: 'businessId',
    }) businessId: string,
  ): Promise<void> {
    const batchSize: number = batch ? parseInt(batch, 10) : BATCH_SIZE;
    this.logger.log(`Started exporting integration subscriptions by name - ${integrationName}`);
    if (!integrationName) {
      this.logger.log('Missing integration_name param');

      return;
    }

    const integration: IntegrationModel = await this.integrationModel.findOne({ name: integrationName});
    if (!integration) {
      this.logger.log('Integration not found');

      return;
    }
    let criteria: any = {
      integration: integration._id,
    };
    if (businessId) {
      criteria = {
        ...criteria,
        businessId: businessId };
    }
    this.logger.log('criteria', JSON.stringify(criteria));
    await this.subscriptionService
      .findAllByCriteria(batchSize, criteria)
      .pipe(
        filter((model: IntegrationSubscriptionModel) => !!(model.integration)),
        mergeMap((model: IntegrationSubscriptionModel) => from(this.findBusinessAndProduce(model)), batchSize),
      )
      .toPromise();

    this.logger.log(`Finished exporting integration subscriptions by name - ${integrationName}`);
  }

  private async findBusinessAndProduce(
    subscription: IntegrationSubscriptionModel,
  ): Promise<void> {
    const business: BusinessModelLocal = await this.subscriptionService.findBusinessBySubscription(subscription);
    if (!business) {
      return;
    }

    return this.eventProducer.exportSubscriptionsToProduct(subscription, business);
  }

  private async findBusinessAndExport(subscription: IntegrationSubscriptionModel): Promise<void> {
    const business: BusinessModelLocal = await this.subscriptionService.findBusinessBySubscription(subscription);
    if (!business) {
      return;
    }

    return this.integrationSubscriptionEventProducer.onExport(business.id, subscription);
  }
}
