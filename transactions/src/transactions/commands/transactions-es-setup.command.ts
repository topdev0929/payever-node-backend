import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { Command } from '@pe/nest-kit';
import { ElasticMappingFieldsConfig, ElasticTransactionEnum } from '../enum';

@Injectable()
export class TransactionsEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'transactions:es:setup',
    describe: 'Setup field-mapping transactions for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticTransactionEnum.index)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticTransactionEnum.index);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticTransactionEnum.index,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
      },
    );

    for (const field in ElasticMappingFieldsConfig) {
      if (ElasticMappingFieldsConfig[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticTransactionEnum.index,
          field,
          ElasticMappingFieldsConfig[field],
        );
      }
    }
  }
}
