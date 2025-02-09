import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RabbitMqClient } from '@pe/nest-kit';
import { Model } from 'mongoose';
import * as Excel from 'exceljs';
import { BusinessModel } from '../models';
import { BusinessSchemaName } from '../schemas';
import * as ArrayBufferEncoder from 'base64-arraybuffer';
import {
  BUSINESS_EXPORT_REPORT_EMAIL_BODY, BUSINESS_EXPORT_REPORT_EMAIL_SUBJECT, BUSINESS_EXPORT_REPORT_FILENAME,
  DEFAULT_COLUMN_WIDTH, REPORT_HEADER_COLOR, REPORT_OVERALL_COLOR,
} from '../constants';
import { BusinessDetailInterface, BusinessInterface, UserInterface } from '../interfaces';
import { environment } from '../../environments';
import { EmailAttachmentDto, EmailDto } from '../dto/email';
import { MailerEnum } from '../enums';

@Injectable()
export class BusinessExporterService {

  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private readonly rabbitMqClient: RabbitMqClient,
  ) { }

  public async export(fromDate: Date, toDate: Date, registrationOrigins: string[]): Promise<void> {
    const workbook: Excel.Workbook = new Excel.Workbook();
    const worksheet: Excel.Worksheet = workbook.addWorksheet('Business List');
    const businesses: BusinessInterface[] = await this.findBusinessByDateAndOrigin(
      fromDate,
      toDate, registrationOrigins);
    this.setReportHeader(worksheet);
    this.setRowsData(worksheet, businesses);
    const reportBuffer: Excel.Buffer = await workbook.xlsx.writeBuffer();
    const xlsContent: string = ArrayBufferEncoder.encode(reportBuffer);
    const subject: string = this.generateSubject(fromDate, toDate);
    await this.sendEmailEvent(xlsContent, subject);
  }
  private generateSubject(fromDate: Date, toDate: Date): string {
    return `${BUSINESS_EXPORT_REPORT_EMAIL_SUBJECT} ${fromDate.toDateString()} to ${toDate.toDateString()}`;
  }

  private async findBusinessByDateAndOrigin(
    fromDate: Date, toDate: Date,
    registrationOrigins: string[],
  ): Promise<BusinessInterface[]> {
    const condition: any = { createdAt: { $gte: fromDate, $lte: toDate } } as any;
    if (registrationOrigins.length > 0) {
      condition.registrationOrigin = { $in: registrationOrigins };
    }

    return this.businessModel.find(condition).populate('owner').populate('businessDetail');
  }

  private setRowsData(worksheet: Excel.Worksheet, businesses: BusinessInterface[]): void {
    businesses.forEach((business: BusinessInterface) => {
      const owner: UserInterface = business?.owner as UserInterface;
      const businessDetail: BusinessDetailInterface = business?.businessDetail as BusinessDetailInterface;
      worksheet.addRow([
        business.name,
        owner?.userAccount?.email,
        businessDetail.companyAddress?.country,
        businessDetail.companyAddress?.city,
        businessDetail.companyAddress?.street,
        businessDetail.companyAddress?.zipCode,
        business.registrationOrigin,
        business.createdAt,
      ]);
    });
  }
  private setReportHeader(
    worksheet: Excel.Worksheet,
  ): void {
    const columns: Array<{ header: string; width: number }> = [
      { header: 'Name', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Email', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Country', width: DEFAULT_COLUMN_WIDTH },
      { header: 'City', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Street', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Zip Code', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Registration Origin', width: DEFAULT_COLUMN_WIDTH },
      { header: 'Registration Date', width: DEFAULT_COLUMN_WIDTH },
    ];
    worksheet.columns = columns;
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }
  private setRowFillColor(row: Excel.Row, fillColor: string = REPORT_OVERALL_COLOR): void {
    row.eachCell((cell: Excel.Cell) => {
      cell.fill = {
        fgColor: { argb: fillColor },
        pattern: 'darkVertical',
        type: 'pattern',
      };
    });
  }
  private async sendEmailEvent(xlsContent: string, subject: string): Promise<void> {
    const attachmentDto: EmailAttachmentDto = new EmailAttachmentDto();
    attachmentDto.filename = BUSINESS_EXPORT_REPORT_FILENAME;
    attachmentDto.content = xlsContent;
    const emailDto: EmailDto = new EmailDto();
    emailDto.to = environment.businessExportReportEmailTo;
    emailDto.cc = environment.businessExportReportEmailCc;
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
      true
    );
  }
}
