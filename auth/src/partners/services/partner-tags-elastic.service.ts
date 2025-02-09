import { Injectable, Logger } from '@nestjs/common';
import { ElasticSearchClient, DelayRemoveClient } from '@pe/elastic-kit';
import { Document } from 'mongoose';

import { ElasticPartnerTagEnum } from '../enum';
import { PartnerTagInterface } from '../interfaces';

@Injectable()
export class PartnerTagsElastic {
  constructor(
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  public async saveIndex(partnerTag: PartnerTagInterface | (PartnerTagInterface & Document)): Promise<any> {
    await this.elasticSearchClient.singleIndex(
      ElasticPartnerTagEnum.index,
      partnerTag.toObject ? partnerTag.toObject() : partnerTag,
    );
  }

  public async removeIndex(partnerTag: PartnerTagInterface): Promise<any> {
    const delayRemoveClient: DelayRemoveClient = new DelayRemoveClient(this.elasticSearchClient, this.logger);

    await delayRemoveClient.deleteByQuery(
      ElasticPartnerTagEnum.index,
      ElasticPartnerTagEnum.type,
      {
        query: {
          match_phrase: {
            _id: partnerTag._id,
          },
        },
      },
    );
  }
}
