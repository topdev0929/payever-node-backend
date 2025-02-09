import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ElasticSearchClient } from '@pe/elastic-kit';
import { Command, Option } from '@pe/nest-kit';
import { elasticConfig } from '../config';

import { SpotlightModel } from '../models';
import { SpotlightInterface } from '../interfaces';
import { SpotlightSchemaName } from '../schemas';

@Injectable()
export class SpotlightEsInitialExportCommand {
  constructor(
    @InjectModel(SpotlightSchemaName)
      private readonly spotlightModel: Model<SpotlightModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
  ) { }

  @Command({ command: 'spotlight:es:initial-export [--app]', describe: 'Initial export spotlight-documents for ElasticSearch' })
  public async export(
    @Option({
      name: 'app',
    }) app: string,
  ): Promise<void> {

    const criteria: any = { _id: { $ne: null } };

    if (app) {
      criteria.app = app;
    }

    Logger.log({
      message: `Start export documents`,
    });

    const total: number = await this.spotlightModel.countDocuments(criteria).exec();
    Logger.log(`Found ${total} records.`);

    const limit: number = 1000;
    let processed: number = 0;

    while (processed < total) {
      const documents: SpotlightModel[] = await this.getWithLimit(processed, limit, criteria);
      if (documents.length === 0) {
        break;
      }

      const documentsToIndex: SpotlightInterface[] = this.prepareDocumentToIndex(documents);

      Logger.log(`Starting next ${documentsToIndex.length} documents.`);

      await this.elasticSearchClient.bulkIndex(
        elasticConfig.index.elasticIndex,
        documentsToIndex,
      );

      processed += documentsToIndex.length;
      Logger.log(`Exported ${processed} of ${total}.`);
    }
  }

  private prepareDocumentToIndex(documents: SpotlightModel[]): SpotlightInterface[] {
    return documents.map((document: SpotlightModel) => document.toObject());
  }

  private async getWithLimit(
    start: number,
    limit: number,
    criteria: any,
  ): Promise<SpotlightModel[]> {
    return this.spotlightModel.find(
      criteria,
      null,
      {
        limit: limit,
        skip: start,
      },
    );
  }
}
