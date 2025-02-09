import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { Command } from '@pe/nest-kit';
import { ElasticPaymentLinksEnum, ElasticMappingFieldsConfig } from '../enums';
import { PaymentLinksFoldersConfig } from '../configs/payment-links-folders.config';

@Injectable()
export class CheckoutPaymentLinksEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'checkout-payment-links:es:setup',
    describe: 'Setup field-mapping checkout-payment-links for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticPaymentLinksEnum.index)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticPaymentLinksEnum.index);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticPaymentLinksEnum.index,
      {
        index: {
          max_result_window: 500000,
          refresh_interval: null,
        },
      },
    );

    for (const field in PaymentLinksFoldersConfig.elastic.mappingFields) {
      if (ElasticMappingFieldsConfig[field]) {
        await this.elasticSearchClient.setupFieldMapping(
          ElasticPaymentLinksEnum.index,
          field,
          ElasticMappingFieldsConfig[field],
        );
      }
    }
  }
}
