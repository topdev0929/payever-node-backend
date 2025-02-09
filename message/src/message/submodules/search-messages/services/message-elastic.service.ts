import { ApiResponse } from '@elastic/elasticsearch';
import { Injectable } from '@nestjs/common';

import {
  ElasticSearchClient,
  ElasticSearchExpressionsEnum,
  ElasticSearchQueryBuilder,
  ExpressionsFactory,
  SearchResultBodyDto,
  SearchResultItemDto,
} from '@pe/elastic-kit';
import {
  AbstractChatMessageDocument,
  ChatTextMessage,
  DecryptedAbstractChatMessageInterface,
} from '../../platform';
import { ElasticMessageEnum } from '../../../enums';

import { messageToEsTransformer } from '../transformers';
import { MessageEsDocument, SearchResultInterface } from '../interfaces';

@Injectable()
export class MessageElasticService {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  public async searchMessages(
    chat: string,
    query: string,
  ): Promise<SearchResultInterface> {
    const queryBuilder: ElasticSearchQueryBuilder = new ElasticSearchQueryBuilder();

    queryBuilder.must(
      ExpressionsFactory.getExpression('content', query, ElasticSearchExpressionsEnum.Contains),
    );

    if (chat) {
      queryBuilder.must(ExpressionsFactory.getExpression('chat', chat, ElasticSearchExpressionsEnum.Match));
    }

    const results: ApiResponse<SearchResultBodyDto<MessageEsDocument>, unknown> =
      await this.elasticSearchClient.search<MessageEsDocument>(
        ElasticMessageEnum.index,
        queryBuilder.getRequest(),
      );

    return {
      identifiers: results.body.hits.hits.map((item: SearchResultItemDto<MessageEsDocument>) => item._id),
      total: results.body.hits.total,
    };
  }

  public async saveIndex(
    messages: DecryptedAbstractChatMessageInterface[],
  ): Promise<void> {
    const esDocumentsPrototypes: MessageEsDocument[] = messages
      // eslint-disable-next-line @typescript-eslint/unbound-method
      .filter(ChatTextMessage.isTypeOf)
      .map(messageToEsTransformer);

    await this.elasticSearchClient.bulkIndex(
      ElasticMessageEnum.index,
      esDocumentsPrototypes.filter(Boolean),
    );
  }

  public async deleteIndex(messages: AbstractChatMessageDocument[]): Promise<void> {
    for (const message of messages) {
      await this.elasticSearchClient.deleteByQuery(
        ElasticMessageEnum.index,
        {
          query: {
            match_phrase: {
              mongoId: message.id,
            },
          },
        });
    }
  }
}
