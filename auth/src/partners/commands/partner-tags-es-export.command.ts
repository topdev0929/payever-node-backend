import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { InjectModel } from '@nestjs/mongoose';

import { PartnerTagInterface } from '../interfaces';
import { ElasticPartnerTagEnum } from '../enum';
import { PartnerBusinessSchemaName } from '../schemas';
import { Model } from 'mongoose';

@Injectable()
export class PartnerTagsEsExportCommand {
  constructor(
    @InjectModel(PartnerBusinessSchemaName) private readonly businessModel: Model<PartnerTagInterface>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'partner-tags:es:export [--business]', describe: 'Export products for ElasticSearch' })
  public async export(
    @Option({
      name: 'business',
    }) businessId?: string,
  ): Promise<void> {
    const criteria: any = { };

    if (businessId) {
      criteria._id = businessId;
    }

    this.logger.log(`Criteria is ${JSON.stringify(criteria, null, 2)}.`);

    const sort: { } = { _id: 1};
    const limit: number = 100;
    let page: number = 1;

    let processedPartnerTagsCount: number = 0;
    while (true) {
      const partnerTags: PartnerTagInterface[] = await this.businessModel
        .find(criteria)
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .lean()
        .exec() as any
      ;

      if (!partnerTags.length) {
        break;
      }

      const batch: PartnerTagInterface[] = [];
      for (const partnerTag of partnerTags) {
        batch.push(partnerTag.toObject());
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticPartnerTagEnum.index,
        batch,
      );

      processedPartnerTagsCount += partnerTags.length;
      page++;
    }

    this.logger.log(processedPartnerTagsCount + ' businesses was processed');
  }
}
