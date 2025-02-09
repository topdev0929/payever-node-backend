import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ElasticIndexEnum, ElasticMappingFieldsConfig } from '../enums';
import { ElasticSearchClient } from '@pe/elastic-kit';

@Injectable()
export class CollectionsEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'collections:es:setup',
    describe: 'Setup field-mapping products for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticIndexEnum.collectionIndex)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticIndexEnum.collectionIndex);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticIndexEnum.collectionIndex,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
        number_of_shards: 1,
      },
    );

    for (const field in ElasticMappingFieldsConfig.collection) {
      if (ElasticMappingFieldsConfig.collection[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticIndexEnum.collectionIndex,
          field,
          ElasticMappingFieldsConfig.collection[field],
        );
      }
    }
  }
}
