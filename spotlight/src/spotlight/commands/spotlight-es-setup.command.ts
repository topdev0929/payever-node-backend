import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { Command } from '@pe/nest-kit';
import { elasticConfig } from '../config';

@Injectable()
export class SpotlightEsSetupCommand {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({
    command: 'spotlight:es:setup',
    describe: 'Setup field-mapping of spotlight for ElasticSearch',
  })
  public async setup(): Promise<void> {
    if (!await this.elasticSearchClient.isIndexExists(elasticConfig.index.elasticIndex)) {
      Logger.log(`Creating index.`);
      await this.elasticSearchClient.createIndex(elasticConfig.index.elasticIndex);
    }

    await this.elasticSearchClient.closeIndex(elasticConfig.index.elasticIndex);

    await this.elasticSearchClient.putIndexSettings(
      elasticConfig.index.elasticIndex,
      {
        index: {
          max_result_window: 1000000,
          refresh_interval: null,
        },
        analysis: {
          analyzer: {
            autocomplete: {
              filter: [
                'lowercase',
                'edge_ngram_filter',
              ],
              tokenizer: 'uax_url_email',
            },
            autocomplete_search: {
              tokenizer: 'lowercase',
            },
          },
          normalizer: {
            case_insensitive: {
              filter: 'lowercase',
            },
          },
          filter: {
            edge_ngram_filter: {
              max_gram: 10,
              min_gram: 1,
              token_chars: [
                'letter',
                'digit',
                'punctuation',
                'symbol',
              ],
              type: 'edge_ngram',
            },
          },
        },
      },
    );

    await this.elasticSearchClient.openIndex(elasticConfig.index.elasticIndex);

    for (const field in elasticConfig.mappingFields) {
      if (elasticConfig.mappingFields[field]) {
        await this.setupFieldMapping(field, elasticConfig.mappingFields[field]);
      }
    }
  }

  private async setupFieldMapping(field: string, config: any): Promise<void> {
    await this.elasticSearchClient.setupFieldMapping(
      elasticConfig.index.elasticIndex,
      field,
      config,
    );
  }
}
