import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ReportDetailModel } from '../models';
import { ReportDetail } from '../schemas';
import { ProcessingStatus } from '../enums';

@Injectable()
export class ReportDetailService {
  constructor(
    @InjectModel(ReportDetail.name) private readonly reportDetailModel: Model<ReportDetailModel>,
  ) { }
  
  public async findById(id: string): Promise<ReportDetailModel> {
    return  this.reportDetailModel.findById(id);
  }

  public async create(dto: Partial<ReportDetail>): Promise<ReportDetailModel> {
    return this.reportDetailModel.create(dto);
  }

  public async countDone(reportId: string): Promise<number> {
    return this.reportDetailModel.countDocuments({ report: reportId, status: ProcessingStatus.Finished });
  }

  public async isReportProcessed(reportId: string): Promise<boolean> {
    const totalCount: number =  await this.reportDetailModel.countDocuments({ report: reportId });
    const processed: number = await this.reportDetailModel.countDocuments({ 
      report: reportId, 
      status: { $in: [ProcessingStatus.Finished, ProcessingStatus.Error] },
    });

    return totalCount === processed;
  }

  public async aggregateReportResult(reportId: string): Promise<any> {

    const isReportDone: boolean = await this.isReportProcessed(reportId);
    if (!isReportDone) {
      throw new BadRequestException(`Report is processing`);
    }

    const errorReportDetails: ReportDetail[] = await this.reportDetailModel.find(
      { report: reportId, status: ProcessingStatus.Error },
      'error businessName businessId',
    );

    const validBusinessDetails: ReportDetail[] = await this.reportDetailModel.find(
      { report: reportId, status: ProcessingStatus.Finished, valid: true },
      'businessName businessId',
    );

    const invalidBusinessDetails: ReportDetail[] = await this.reportDetailModel.find(
      { report: reportId, status: ProcessingStatus.Finished, valid: false },
      'businessName businessId resultData',
    );

    invalidBusinessDetails.forEach((businessDetail: ReportDetail) => { 
      Object.keys(businessDetail.resultData).forEach((key: string) => {
        if (businessDetail.resultData[key].valid) {
          delete businessDetail.resultData[key];
        }
      });
    });

    return {
      errors: errorReportDetails,
      invalid: invalidBusinessDetails,
      valid: validBusinessDetails,
    };
  }
}
