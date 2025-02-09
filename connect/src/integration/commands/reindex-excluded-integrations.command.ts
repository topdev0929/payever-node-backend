import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { CategoryService, IntegrationService, IntegrationSubscriptionService } from '../services';
import { IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FolderDocumentInterface, FolderDocumentsService } from '@pe/folders-plugin';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { FoldersConfig } from '../config';
import { BusinessModelLocal } from '../../business';
/**
 * usage:
 * npm run cli folder-documents:es:reindex-excluded-integrations -- --integrationName=santander_installment_no
 */
@Injectable()
export class ReindexExcludedIntegrationsCommand {
  constructor(
    @InjectModel('Business')
    private readonly businessModel: Model<BusinessModelLocal>,
    private readonly integrationService: IntegrationService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  @Command({
    command: 'folder-documents:es:reindex-excluded-integrations',
    describe: 'Remove from index excluded integrations',
  })
  public async command(
    @Positional({
      name: 'integrationName',
    }) integrationName: string,
  ): Promise<void> {

    if (!integrationName) {
      throw new Error(`Integration by name “${integrationName}” not found.`);
    }

    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
    if (!integration) {
      throw new Error(`Integration by name “${integrationName}” not found.`);
    }

    const businesses: BusinessModelLocal[] = await this.businessModel
      .find({ excludedIntegrations: integration._id })
      .limit(10).exec();

    if (!businesses || businesses.length === 0) {
      this.logger.log(`OK: No businesses have the  integration “${integrationName}” excluded.`);

      return;
    }

    const businessesIds: string[] = businesses.map((business: BusinessModelLocal) => business._id);

    this.logger.log(`Delete integration "${integration._id}" for ${businessesIds.length} 
    businesses in ${FoldersConfig.elastic.index.elasticIndex}`);

    await this.elasticSearchClient.deleteByQuery(
      FoldersConfig.elastic.index.elasticIndex,
      {
        'query': {
          'bool': {
            'must': [
              {
                'term': {
                  'integration': integration._id,
                },
              },
              {
                'terms': {
                  'businessId': businessesIds,
                },
              },
            ],
          },
        },
      },
    );

    this.logger.log('OK: Reindex excluded integrations finished');
  }
}
