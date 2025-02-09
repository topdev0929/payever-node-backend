import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BulkImportModel, ReportDetailModel, ReportModel, TaskModel } from '../../src/onboarding/models';
import { getModelToken } from '@nestjs/mongoose';
import { BulkImport } from '../../src/onboarding/schemas/bulk-import.schema';
import { BULK_IMPORT_ID, REPORT_DETAIL_ID, REPORT_ID, TASK_ID, BUSINESS_ID, BULK_IMPORT_ID_2 } from './const';
import { Report, ReportDetail, Task } from '../../src/onboarding/schemas';
import * as taskPrototype from './task.json';

class BulkImportFixture extends BaseFixture {
    protected readonly bulkImportModel: Model<BulkImportModel> =
    this.application.get(getModelToken(BulkImport.name));

    protected readonly taskModel: Model<TaskModel> =
    this.application.get(getModelToken(Task.name));

    protected readonly reportModel: Model<ReportModel> =
    this.application.get(getModelToken(Report.name));

    protected readonly reportDetailModel: Model<ReportDetailModel> =
    this.application.get(getModelToken(ReportDetail.name));

  public async apply(): Promise<void> {
    await this.createBulkImport();
    await this.createTask();
    await this.createReport();
    await this.createReportDetail();
  }

  private async createBulkImport(): Promise<void> {
    await this.bulkImportModel.create({
      _id: BULK_IMPORT_ID,
      tasks: [TASK_ID],
      latestReport: REPORT_ID,
    });

    await this.bulkImportModel.create({
      _id: BULK_IMPORT_ID_2,
      tasks: [TASK_ID],
      latestReport: REPORT_ID,
    });
  }

  private async createTask(): Promise<void> {
    await this.taskModel.create({
      ...taskPrototype,
      _id: TASK_ID,
      bulkImportId: BULK_IMPORT_ID,
      businessId: BUSINESS_ID,
      token: '-old-token-value',
    });
  }

  private async createReport(): Promise<void> {
    await this.reportModel.create({
      _id: REPORT_ID,
      bulkImportId: BULK_IMPORT_ID,
      businessId: 'test', 
      businessName: 'test',
    });
  }

  private async createReportDetail(): Promise<void> {
    await this.reportDetailModel.create({
      _id: REPORT_DETAIL_ID,
      report: REPORT_ID,
      businessId: 'test',
      businessName: 'test',
      status: 'finished',
      valid: true,
    });
  }
}
export = BulkImportFixture;
