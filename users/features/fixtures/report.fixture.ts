import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BULK_IMPORT_ID, REPORT_DETAIL_ID, REPORT_ID, TASK_ID, BUSINESS_ID, BULK_IMPORT_ID_2 } from './const';
import { BulkImport, Report, ReportDetail, Task } from '../../src/employees/schemas';

class BulkImportFixture extends BaseFixture {
    protected readonly bulkImportModel: Model<BulkImport> =
    this.application.get(getModelToken(BulkImport.name));

    protected readonly taskModel: Model<Task> =
    this.application.get(getModelToken(Task.name));

    protected readonly reportModel: Model<Report> =
    this.application.get(getModelToken(Report.name));

    protected readonly reportDetailModel: Model<ReportDetail> =
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
      _id: TASK_ID,
      bulkImportId: BULK_IMPORT_ID,
      businessId: BUSINESS_ID,
      incomingData: {
        acls: [{
          microservice: 'pos',
          create: true,
          read: true,
          delete: true,
          update: true,
        }],
        firstName: 'test',
        lastName: 'test',
        phone: 'test',
        email: 'email@test.com',
        userId: '8a13bd00-90f1-11e9-9f67-7200004fe4c1',
        positions: [
          {
            businessId: BUSINESS_ID,
            status: 1,
            positionType: 'Admin'
          }
        ]
      },
      employeeId: '8a13bd00-90f1-11e9-9f67-7200004fe4c2',
    });
  }

  private async createReport(): Promise<void> {
    await this.reportModel.create({
      _id: REPORT_ID,
      bulkImportId: BULK_IMPORT_ID,
      businessId: 'test', 
      businessName: 'test',
      token: 'token',
      userAgent: 'user-agent'
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
