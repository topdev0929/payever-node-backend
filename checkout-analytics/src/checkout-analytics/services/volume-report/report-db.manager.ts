import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReportSchemaName } from '../../schemas';
import { ReportModel } from '../../models';
import { ReportInterface } from '../../interfaces';
import { ReportTypesEnum } from '../../enums/report-types.enum';

@Injectable()
export class ReportDbManager {
  constructor(
    @InjectModel(ReportSchemaName) private readonly reportModel: Model<ReportModel>,
  ) { }

  public async storeReportData(report: ReportInterface): Promise<ReportModel> {
    return this.reportModel.create(report);
  }

  public async getReportsByTypeAndDate(
    type: ReportTypesEnum,
    from: Date,
    to: Date,
  ): Promise<ReportModel[]> {
    return this.reportModel.find(
      {
        type,

        from: { $gte: from },
        to: { $lte: to },
      },
      null,
      {
        sort: { from: 1 },
      },
    );
  }
}
