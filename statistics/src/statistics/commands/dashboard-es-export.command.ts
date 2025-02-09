import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, LeanDocument } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticDashboardEnum } from '../enums';
import { DashboardModel } from '../models';
import { DashboardSchemaName } from '../schemas';

@Injectable()
export class DashboardEsExportCommand {
  constructor(
    @InjectModel(DashboardSchemaName) private readonly dashboardModel: Model<DashboardModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity array-type */
  @Command({ command: 'dashboard:es:export', describe: 'Export dashboards for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedDashboardsCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const dashboards: DashboardModel[] =
        await this.dashboardModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!dashboards.length) {
        break;
      }

      const batch: Array<LeanDocument<DashboardModel>> = [];
      for (const dashboard of dashboards) {
        batch.push({
          ...dashboard.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticDashboardEnum.index,
        batch,
      );

      processedDashboardsCount += dashboards.length;
      page++;
    }

    this.logger.log(processedDashboardsCount + ' dashboards was processed');
  }
}
