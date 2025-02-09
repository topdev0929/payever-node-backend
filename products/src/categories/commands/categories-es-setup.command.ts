import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ElasticIndexEnum, ElasticMappingFieldsConfig } from '../enums';
import { ElasticSearchClient } from '@pe/elastic-kit';

@Injectable()
export class CategoriesEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'categories:es:setup',
    describe: 'Setup field-mapping products for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticIndexEnum.categoryIndex)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticIndexEnum.categoryIndex);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticIndexEnum.categoryIndex,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
        number_of_shards: 1,
      },
    );

    for (const field in ElasticMappingFieldsConfig.category) {
      if (ElasticMappingFieldsConfig.category[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticIndexEnum.categoryIndex,
          field,
          ElasticMappingFieldsConfig.category[field],
        );
      }
    }
  }
}
