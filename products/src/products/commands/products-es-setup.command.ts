import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ElasticProductEnum, ElasticMappingFieldsConfig } from '../enums';
import { ElasticSearchClient } from '@pe/elastic-kit';

@Injectable()
export class ProductsEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'products:es:setup',
    describe: 'Setup field-mapping products for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticProductEnum.index)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticProductEnum.index);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticProductEnum.index,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
        number_of_shards: 1,
      },
    );

    for (const field in ElasticMappingFieldsConfig) {
      if (ElasticMappingFieldsConfig[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticProductEnum.index,
          field,
          ElasticMappingFieldsConfig[field] as any,
        );
      }
    }
  }
}
