import { Injectable, Logger } from '@nestjs/common';
import { VolumeReportManager } from './volume-report.manager';
import { VolumeReportSpreadsheetGenerator } from './volume-report-spreadsheet.generator';
import { VolumeReportDto } from '../../dto/volume-report';
import { environment } from '../../../environments';
import { RabbitMqClient } from '@pe/nest-kit';
import { MessageBusEventsEnum, ReportCountriesEnum } from '../../enums';
import { EmailAttachmentDto, EmailDto } from '../../dto/email';
import { VOLUME_REPORT_EMAIL_BODY, VOLUME_REPORT_EMAIL_SUBJECT, VOLUME_REPORT_FILENAME } from '../../constants';
import { reportParamsInterface } from '../../interfaces';

@Injectable()
export class VolumeReportSender {
  constructor(
    private readonly reportManager: VolumeReportManager,
    private readonly spreadsheetGenerator: VolumeReportSpreadsheetGenerator,
    private readonly rabbitMqClient: RabbitMqClient,
    private readonly logger: Logger,
  ) { }

  public async generateAndSendToEmailVolumeReport(
    dateFrom: Date = null,
    dateTo: Date = null,
    country?: ReportCountriesEnum,
  ): Promise<void> {
    try {
      const reportDto: VolumeReportDto = await this.reportManager.createReport(dateFrom, dateTo, country);
      const xlsContent: string = await this.spreadsheetGenerator.generateVolumeReportContent(reportDto);
      await this.sendEmailEvent(reportDto, xlsContent);
    } catch (e) {
      this.logger.log(
        {
          error: e.message,
          message: 'Failed to generate and send volume report',
          stack: e.stack,
        },
      );
    }
  }

  public async loadFromDbAndSendToEmailVolumeReport(
    { country, dateFrom, dateTo, previousDateFrom, previousDateTo }: reportParamsInterface
  ): Promise<void> {
    try {
      const reportDto: VolumeReportDto = await this.reportManager.prepareReportFromDb(
        dateFrom,
        dateTo,
        previousDateFrom,
        previousDateTo,
        country,
      );
      const xlsContent: string = await this.spreadsheetGenerator.generateVolumeReportContent(reportDto);
      await this.sendEmailEvent(reportDto, xlsContent);
    } catch (e) {
      this.logger.log(
        {
          error: e.message,
          message: 'Failed to load from db and send volume report',
          stack: e.stack,
        },
      );
    }
  }

  private async sendEmailEvent(reportDto: VolumeReportDto, xlsContent: string): Promise<void> {
    const attachmentDto: EmailAttachmentDto = new EmailAttachmentDto();
    attachmentDto.filename = VOLUME_REPORT_FILENAME;
    attachmentDto.content = xlsContent;

    const emailDto: EmailDto = new EmailDto();
    emailDto.to = environment.volumeReportEmailTo;
    emailDto.cc = environment.volumeReportEmailCc;
    emailDto.subject = `${VOLUME_REPORT_EMAIL_SUBJECT} ${reportDto.transactionsReport.reportDate}`;
    emailDto.html = VOLUME_REPORT_EMAIL_BODY;
    emailDto.attachments.push(attachmentDto);

    await this.rabbitMqClient.send(
      {
        channel: MessageBusEventsEnum.SendMail,
        exchange: 'async_events',
      },
      {
        name: MessageBusEventsEnum.SendMail,
        payload: emailDto,
      },
    );
  }
}
