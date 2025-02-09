import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticIntegrationEnum } from '../enum';
import { IntegrationModel } from '../models';
import { IntegrationSchemaName } from '../schemas';

@Injectable()
export class IntegrationEsExportCommand {
  constructor(
    @InjectModel(IntegrationSchemaName) private readonly integrationModel: Model<IntegrationModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'integrations:es:export', describe: 'Export integrations for ElasticSearch' })
  public async export(): Promise<void> {
    const integrations: IntegrationModel[] =
      await this.integrationModel.find({ });
    this.logger.log(integrations.length + ' integrations to be processed');

    const batch: Array<DocumentDefinition<IntegrationModel>> = [];
    for (const integration of integrations) {
      batch.push({
        ...integration.toObject(),
      });
    }

    await this.elasticSearchClient.bulkIndex(
      ElasticIntegrationEnum.index,
      batch,
    );

    this.logger.log(integrations.length + ' integrations were processed');
  }
}
