import { Injectable, Logger } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { IntegrationService } from '../services';
import { IntegrationModel } from '../../integration/models';
import { FolderDocumentsEsExportCommand } from '@pe/folders-plugin';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { FoldersConfig } from '../config';

@Injectable()
export class ReindexAllowedBusinessesCommand {
  constructor(
    private readonly logger: Logger,
    private readonly integrationService: IntegrationService,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly folderDocumentsEsExportCommand: FolderDocumentsEsExportCommand,
  ) { }

  @Command({
    command: 'folder-documents:es:reindex-allowed-businesses',
    describe: 'Reindex allowed businesses',
  })
  public async export(
    @Positional({
      name: 'integrationName',
    }) integrationName: string,

  ): Promise<void> {
    this.logger.log('Reindex allowed businesses');
    const integration: IntegrationModel = await this.integrationService.findOneByName(integrationName);
    if (!integrationName) {
      throw new Error(`Integration by name ${integrationName} not found`);
    }

    let criteria: any = {
      integration: integration._id,
    };

    if (integration.allowedBusinesses && integration.allowedBusinesses.length) {
      criteria = {
        ...criteria,
        businessId: { $in: integration.allowedBusinesses},
      };
    }

    this.logger.log(`Delete integration for all businesses for ${FoldersConfig.elastic.index.elasticIndex}`);
    await this.elasticSearchClient.deleteByQuery(
      FoldersConfig.elastic.index.elasticIndex,
      {
        query: {
          match_phrase: {
            integration: integration._id,
          },
        },
      },
    );

    const criteriaString: string = JSON.stringify(criteria);
    await this.folderDocumentsEsExportCommand.export(
      criteriaString,
      '',
      false,
      true,
      false,
      false,
      false,
      true,
      1,
      0,
      null,
      250,
      '',
      '',
    );

    this.logger.log('Reindex allowed businesses finished');
  }
}
