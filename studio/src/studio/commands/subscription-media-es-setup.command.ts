import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { SubscriptionMediaMapping } from '../configs';
import { ElasticSearchClient } from '@pe/elastic-kit/module';
import { ElasticIndexEnum } from '../enums';

@Injectable()
export class SubscriptionMediaEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'subscription-media:es:setup',
    describe: 'Setup field-mapping subscription-media for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticIndexEnum.subscriptionMedia)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticIndexEnum.subscriptionMedia);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticIndexEnum.subscriptionMedia,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
      },
    );

    for (const field in SubscriptionMediaMapping) {
      if (SubscriptionMediaMapping[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticIndexEnum.subscriptionMedia,
          field,
          SubscriptionMediaMapping[field],
        );
      }
    }
  }
}
