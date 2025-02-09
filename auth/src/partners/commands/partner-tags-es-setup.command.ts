import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';

import { ElasticPartnerTagEnum } from '../enum';
import { ElasticMappingFieldsConfig } from '../elastic-mapping-fields.config';

@Injectable()
export class PartnerTagsEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'partner-tags:es:setup',
    describe: 'Setup field-mapping partner tags for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(ElasticPartnerTagEnum.index)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(ElasticPartnerTagEnum.index);
    }

    await this.elasticSearchClient.putIndexSettings(
      ElasticPartnerTagEnum.index,
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
          ElasticPartnerTagEnum.index,
          field,
          ElasticMappingFieldsConfig[field],
        );
      }
    }
  }
}
