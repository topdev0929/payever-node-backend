import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticSiteEnum } from '../enums';
import { SiteDocument, SiteSchemaName } from '../schemas';
import { siteToResponseDto } from '../transformers';
import { SiteResponseDto } from '../dto';

@Injectable()
export class SiteEsExportCommand {
  constructor(
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteDocument>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'sites:es:export', describe: 'Export sites for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedSitesCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const sites: SiteDocument[] =
        await this.siteModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!sites.length) {
        break;
      }

      const batch: SiteResponseDto[] = [];
      for (const site of sites) {
        await site.populate('domainDocument').populate('accessConfigDocument').execPopulate();

        batch.push(siteToResponseDto(site));
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticSiteEnum.index,
        batch,
      );

      processedSitesCount += sites.length;
      page++;
    }

    this.logger.log(processedSitesCount + ' sites was processed');
  }
}
