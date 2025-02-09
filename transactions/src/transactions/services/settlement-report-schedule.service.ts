import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ScheduleModel } from '../models/schedule.model';
import { Model } from 'mongoose';
import { ScheduleSchemaName } from '../schemas';
import { RabbitMqClient } from '@pe/nest-kit';
import { ExportFormatEnum, MailerEnum, ReportDurationEnum } from '../enum';
import { EmailAttachmentDto, EmailDto } from '../dto/email';
import {
  BUSINESS_XLSX_EXPORT_REPORT_FILENAME,
  BUSINESS_EXPORT_REPORT_EMAIL_BODY,
  BUSINESS_PDF_EXPORT_REPORT_FILENAME,
} from '../constants';
import { ExporterService } from './exporter.service';
import { SettlementReportScheduleDto } from '../dto/export/settlement-report-schedule.dto';
import * as moment from 'moment';
import { capitalize } from 'lodash';
import { ExportSettlementQueryDto } from '../dto/export/export settlement-query.dto';

@Injectable()
export class SettlementReportScheduleService {
  private DEFAULT_LIMIT: number = 20;
  private CHUNK_SIZE: number = 500;
  constructor(
    @InjectModel(ScheduleSchemaName)
    private readonly scheduleModel: Model<ScheduleModel>,
    private readonly rabbitMqClient: RabbitMqClient,
    private readonly exporterService: ExporterService,
    private readonly logger: Logger,
  ) { }

  public async sendScheduledReports(
    duration: ReportDurationEnum,
  ): Promise<void> {
    let thereAreMore: boolean = true;
    let processed: number = 0;
    let sent: number = 0;

    while (thereAreMore) {
      const schedules: ScheduleModel[] = await this.findAllAwaitingSchedules(
        duration,
        this.CHUNK_SIZE,
        processed,
      );

      for (const schedule of schedules) {
        const query: ExportSettlementQueryDto = {
          business_id: schedule.businessId,
          end_date: new Date(),
          payment_method: schedule.paymentMethod,
          start_date: this.getStartingTimeOfDuration(
            schedule.duration as ReportDurationEnum,
          ),
        };
        if (schedule.format === ExportFormatEnum.xlsx) {
          const xlsContent: string =
            await this.exporterService.exportSettlementPaymentsToExcel(query);
          if (xlsContent.length === 0) {
            continue;
          }
          await this.sendEmailEvent(
            xlsContent,
            this.getSubject(duration, schedule.paymentMethod),
            schedule.email,
            schedule.format,
          );
          await schedule.updateOne({ lastSent: new Date() });
          sent++;
        } else if (schedule.format === ExportFormatEnum.pdf) {
          const pdfContent: string =
            await this.exporterService.exportSettlementPaymentsToPDF(query);
          if (pdfContent.length === 0) {
            continue;
          }
          await this.sendEmailEvent(
            pdfContent,
            this.getSubject(duration, schedule.paymentMethod),
            schedule.email,
            schedule.format,
          );
          await schedule.updateOne({ lastSent: new Date() });
          sent++;
        }
      }

      thereAreMore = schedules.length === this.CHUNK_SIZE;
      processed += schedules.length;
    }
    this.logger.log({
      context: 'ScheduleService',
      message: `Processed ${processed} Schedules reports, sent ${sent} emails`,
    });
  }

  public async createSchedule(
    dto: SettlementReportScheduleDto,
  ): Promise<ScheduleModel> {
    dto.enabled = true;
    dto.format = dto.format ? dto.format : ExportFormatEnum.xlsx;

    return this.scheduleModel.create(dto);
  }

  public async updateSchedule(
    schedule: ScheduleModel,
    dto: SettlementReportScheduleDto,
  ): Promise<ScheduleModel> {
    dto.format = dto.format ? dto.format : ExportFormatEnum.xlsx;

    return schedule.updateOne({ $set: dto });
  }

  public async getSchedules(
    businessId: string,
    skip: number,
    limit: number,
  ): Promise<ScheduleModel[]> {
    return this.scheduleModel
      .find({ businessId })
      .skip(skip ?? 0)
      .limit(limit ?? this.DEFAULT_LIMIT);
  }

  public async enableSchedule(schedule: ScheduleModel): Promise<void> {
    await schedule.updateOne({ $set: { enabled: true } });
  }

  public async disableSchedule(schedule: ScheduleModel): Promise<void> {
    await schedule.updateOne({ $set: { enabled: false } });
  }

  private getFileName(format: ExportFormatEnum): string {
    switch (format) {
      case ExportFormatEnum.xlsx:
        return BUSINESS_XLSX_EXPORT_REPORT_FILENAME;
      case ExportFormatEnum.pdf:
        return BUSINESS_PDF_EXPORT_REPORT_FILENAME;
      default:
        return '';
    }
  }

  private async sendEmailEvent(
    content: string,
    subject: string,
    email: string,
    format: ExportFormatEnum,
  ): Promise<void> {
    const attachmentDto: EmailAttachmentDto = new EmailAttachmentDto();
    attachmentDto.filename = this.getFileName(format);
    attachmentDto.content = content;
    const emailDto: EmailDto = new EmailDto();
    emailDto.to = email;
    emailDto.subject = subject;
    emailDto.html = BUSINESS_EXPORT_REPORT_EMAIL_BODY;
    emailDto.attachments.push(attachmentDto);

    await this.rabbitMqClient.send(
      {
        channel: MailerEnum.SendEmail,
        exchange: 'async_events',
      },
      {
        name: MailerEnum.SendEmail,
        payload: emailDto,
      },
    );
  }

  private async findAllAwaitingSchedules(
    duration: ReportDurationEnum,
    limit: number,
    offset: number,
  ): Promise<ScheduleModel[]> {
    const query: any = { enabled: true, duration };

    return this.scheduleModel.find(query).skip(offset).limit(limit);
  }

  private getDuration(duration: ReportDurationEnum): number {
    switch (duration) {
      case ReportDurationEnum.Daily:
        return 1;
      case ReportDurationEnum.Weekly:
        return 7;
      case ReportDurationEnum.Monthly:
        const date: Date = new Date();
        const year: number = date.getFullYear();
        const month: number = date.getMonth();
        const day: number = 0;

        return new Date(year, month, day).getDate();
    }
  }

  private getSubject(
    duration: ReportDurationEnum,
    paymentMethod: string,
  ): string {
    switch (duration) {
      case ReportDurationEnum.Daily:
        return `${capitalize(
          paymentMethod,
        )} Daily Settlement Report on ${new Date().toLocaleDateString(
          'en-US',
        )}`;
      case ReportDurationEnum.Weekly:
        return `${capitalize(
          paymentMethod,
        )} Weekly Settlement Report from ${this.getStartingTimeOfDuration(
          duration,
        ).toLocaleDateString('en-US')} to ${new Date().toLocaleDateString(
          'en-US',
        )}`;
      case ReportDurationEnum.Monthly:
        return `${capitalize(
          paymentMethod,
        )} Monthly Settlement Report from ${this.getStartingTimeOfDuration(
          duration,
        ).toLocaleDateString('en-US')} to ${new Date().toLocaleDateString(
          'en-US',
        )}`;
    }
  }

  private getStartingTimeOfDuration(duration: ReportDurationEnum): Date {
    return moment(new Date())
      .subtract(this.getDuration(duration), 'days')
      .toDate();
  }
}
