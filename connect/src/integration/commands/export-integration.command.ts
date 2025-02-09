import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { IntegrationModel } from '../models';
import { IntegrationEventProducer } from '../producer';
import { IntegrationService, IntegrationSubscriptionService } from '../services';
import { BusinessModelLocal } from '../../business';

@Injectable()
export class ExportIntegrationCommand {
  constructor(
    private readonly logger: Logger,
    private readonly integrationService: IntegrationService,
    private readonly subscriptionService: IntegrationSubscriptionService,
    private readonly integrationEventProducer: IntegrationEventProducer,
    @InjectModel('Business')
    private readonly businessModel: Model<BusinessModelLocal>,
  ) { }

  @Command({
    command: 'export:integration',
    describe: 'Export integration bus',
  })
  public async export(): Promise<void> {
    this.logger.log('Exporting integration started');
    await this.integrationService
      .findAllByBatch(100)
      .pipe(
        mergeMap((model: IntegrationModel) => from(this.integrationEventProducer.onExport(model)), 100),
      )
      .toPromise();

    this.logger.log('Exporting integration finished');
  }

  @Command({
    command: 'setup:new-integration:by-name',
    describe: 'Setup Integration subscriptions by integration name',
  })
  public async setupByIntegrationName(
    @Positional({
      name: 'integration_name',
    }) integrationName: string,
  ): Promise<void> {
    this.logger.log(`Started setting up integration subscriptions by name - ${integrationName}`);
    if (!integrationName) {
      this.logger.log('Missing integration_name param');

      return;
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
    if (!integration) {
      this.logger.log('No integration found by integration_name param');

      return;
    }
    const total: number = await this.businessModel.countDocuments({ }).exec();

    this.logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const documents: BusinessModelLocal[] = await this.businessModel.find(
        { },
        null,
        {
          limit: limit,
          skip: processed,
          sort: { _id: 1 },
        },
      ).exec();
      this.logger.log(`Starting next ${documents.length} documents.`);
      if (documents.length === 0) {
        break;
      }

      for (const document of documents) {
        await this.subscriptionService.findOrCreateSubscription(integration, document, false);
      }

      processed += documents.length;
      this.logger.log(`Exported ${processed} of ${total}.`);
    }

    this.logger.log(`Finished setting up integration subscriptions by name - ${integrationName}`);
  }

}
