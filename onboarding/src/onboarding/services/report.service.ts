import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RabbitMqClient } from '@pe/nest-kit';

import { ReportModel, TaskModel } from '../models';
import { Report, ReportDetailDocument, BulkImportDocument, ReportDocument } from '../schemas';
import { ReportRmqMessageDto } from '../dto/report/report-rmq-message.dto';
import { RabbitBinding } from '../enums';
import { BulkImportService } from './bulk-import.service';
import { ReportDetailService } from './report-detail.service';
import { TaskService } from './task.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<ReportModel>,
    private readonly reportDetailService: ReportDetailService,
    private readonly bulkImportService: BulkImportService,
    private readonly taskService: TaskService,
    private readonly rabbitClient: RabbitMqClient,
  ) { }
  
  public async findById(id: string): Promise<ReportModel> {
    return  this.reportModel.findById(id);
  }

  public async create(bulkImportId: string): Promise<ReportModel> {
    return this.reportModel.create({ bulkImportId });
  }

  public async delete(reportId: string): Promise<ReportModel> {
    return this.reportModel.findByIdAndDelete(reportId);
  }

  public async generateReport(bulkImportId: string, token: string): Promise<{ reportId: string }> {
    const bulkImportDocument: BulkImportDocument = await this.bulkImportService.findById(bulkImportId);
    if (!bulkImportDocument) {
      throw new BadRequestException('Given bulk import id does not exists.');
    }

    const latestReport: ReportDocument = await this.findById(bulkImportDocument.latestReport);
    const isReportDone: boolean = await this.reportDetailService.isReportProcessed(bulkImportDocument.latestReport);
    if (latestReport && !isReportDone) {
      throw new BadRequestException(`Report is already processing, ReportId ${bulkImportDocument.latestReport}`);
    }

    const newReport: ReportDocument = await this.create(bulkImportId);

    await this.bulkImportService.updateLatestReport(bulkImportId, newReport._id);
    await this.taskService.updateByBulkImport(bulkImportId, { token });

    for (const taskId of bulkImportDocument.tasks) {

      const task: TaskModel = await this.taskService.findById(taskId);
      const businessName: string = task.incomingData.business.name;

      const reportDetail: ReportDetailDocument = await this.reportDetailService.create(
        { task: taskId, report: newReport._id, businessId: task.businessId, businessName },
      );

      const payload: ReportRmqMessageDto = {
        bulkImportId,
        reportDetailId: reportDetail._id,
        reportId: newReport._id,
        totalTasks: bulkImportDocument.tasks.length,
      };

      await this.rabbitClient.send(
        {
          channel: RabbitBinding.OnboardingGenerateTaskReport,
          exchange: 'async_events',
        },
        {
          name: RabbitBinding.OnboardingGenerateTaskReport,
          payload,
        },
      );
    }

    return {
      reportId: newReport._id,
    };
  }
}
