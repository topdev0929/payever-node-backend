import * as PdfMakePrinter from 'pdfmake/src/printer';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, HttpService } from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as FormData from 'form-data';
import * as ExcelJS from 'exceljs';
import { Model } from 'mongoose';
import * as path from 'path';

import { SettlementReportFileModel, TransactionModel } from '../models';
import { PaymentStatusesEnum, SettlementFormatTypeEnum, SettlementReportSpecificPaymentMethodsEnum } from '../enum';
import { ExportedFileResultDto } from '../dto';
import { IntercomService } from '@pe/nest-kit';
import { SettlementReportFileSchemaName, TransactionSchemaName } from '../schemas';
import { SettlementTransformer } from '../transformers';
import { environment } from '../../environments';
import { DEFAULT_COLUMN_WIDTH, REPORT_HEADER_COLOR, REPORT_OVERALL_COLOR } from '../constants';
import { TransactionSettlementReportInterface } from '../interfaces';
import * as ArrayBufferEncoder from 'base64-arraybuffer';
import {
  CommonSettlementReportDto,
  PspSettlementReportDto,
  SettlementFilterRequestDto,
  SettlementReportFieldsMapping,
  SettlementReportFileResponseDto,
  SettlementReportRequestDto,
} from '../dto/settlement';
import { ThirdPartyCallerService } from './third-party-caller.service';
import { plainToClass } from 'class-transformer';
import { v4 as uuid } from 'uuid';

type SettlementReportResponse = CommonSettlementReportDto[] | SettlementReportFileResponseDto;

@Injectable()
export class SettlementReportService {
  constructor(
    private readonly intercomService: IntercomService,
    private readonly httpService: HttpService,
    private readonly thirdPartyCallerService: ThirdPartyCallerService,
    private readonly logger: Logger,
    @InjectModel(TransactionSchemaName)
    private readonly transactionsModel: Model<TransactionModel>,
    @InjectModel(SettlementReportFileSchemaName)
    private readonly settlementReportFileModel: Model<SettlementReportFileModel>,
  ) {
  }

  public async retrieveSettlementReport(
    settlementReportRequestDto: SettlementReportRequestDto,
    businessId: string,
  ): Promise<SettlementReportResponse> {
    let report: CommonSettlementReportDto[];

    if (Object.values(SettlementReportSpecificPaymentMethodsEnum).includes(
      settlementReportRequestDto.filter.payment_method as SettlementReportSpecificPaymentMethodsEnum,
    )) {
      report = await this.retrievePSPSpecificSettlementReport(settlementReportRequestDto, businessId);
    } else {
      report = await this.retrieveInternalSettlementReport(settlementReportRequestDto, businessId);
    }

    return this.processCommonSettlementReportBasedOnFormat(report, settlementReportRequestDto);
  }

  public async retrievePSPSpecificSettlementReport(
    settlementReportRequestDto: SettlementReportRequestDto,
    businessId: string,
  ): Promise<CommonSettlementReportDto[]> {
    const reportData: any =
      await this.thirdPartyCallerService.retrieveSettlementReport(settlementReportRequestDto, businessId);

    const pspReport: PspSettlementReportDto[] = plainToClass<PspSettlementReportDto, any[]>(
      PspSettlementReportDto,
      reportData,
    );

    return pspReport.map(
      (report: PspSettlementReportDto) => SettlementTransformer.pspSettlementReportToCommonSettlementDto(report),
    );
  }

  public async retrieveInternalSettlementReport(
    settlementReportRequestDto: SettlementReportRequestDto,
    businessId: string,
  ): Promise<CommonSettlementReportDto[]> {
    const transactions: TransactionSettlementReportInterface[] =
      await this.exportSettlementPayments(settlementReportRequestDto.filter, businessId);

    return transactions.map(
      (transaction: TransactionSettlementReportInterface) =>
        SettlementTransformer.internalSettlementReportToCommonSettlementDto(transaction),
    );
  }

  public async getSettlementReportFileContent(file: SettlementReportFileModel): Promise<Buffer> {
    const request: Observable<any> = this.httpService.get(file.url, { responseType: 'arraybuffer' });

    return request
      .pipe(
        map((response: AxiosResponse<any>) => {
          return Buffer.from(response.data, 'binary');
        }),
        catchError((error: AxiosError) => {
          const errorData: any = error.response?.data ? error.response.data : error.message;
          const errorStatus: number = error.response?.status ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
          this.logger.error({
            error: errorData,
            errorStatus: errorStatus,
            fileId: file.id,
            message: 'Failed to download settlement report file',
          });

          throw new HttpException(errorData, errorStatus);
        }),
      )
      .toPromise();
  }

  private async processCommonSettlementReportBasedOnFormat(
    report: CommonSettlementReportDto[],
    requestDto: SettlementReportRequestDto,
  ): Promise<SettlementReportResponse> {
    if (requestDto.format === SettlementFormatTypeEnum.json || !requestDto.format || !report.length) {
      return report;
    }

    const filteredFieldsList: Map<string, string> = new Map<string, string>();
    for (const fieldText of SettlementReportFieldsMapping.keys()) {
      const field: string = SettlementReportFieldsMapping.get(fieldText);
      if (!requestDto.fields || !requestDto.fields.length || requestDto.fields.includes(field)) {
        filteredFieldsList.set(fieldText, field);
      }
    }

    let content: string;
    switch (requestDto.format) {
      case SettlementFormatTypeEnum.xlsx:
        content = await this.exportSettlementReportToExcel(report, filteredFieldsList);
        break;
      case SettlementFormatTypeEnum.csv:
        content = await this.exportSettlementReportToExcel(report, filteredFieldsList, true);
        break;
      case SettlementFormatTypeEnum.pdf:
        content = await this.exportSettlementReportToPDF(report, filteredFieldsList);
        break;
    }

    const id: string = uuid();
    const url: string = await this.storeFileInMedia({ fileName: `${id}.${requestDto.format}`, data: content });
    await this.settlementReportFileModel.create({ _id: id, format: requestDto.format, url });

    return { id };
  }

  private async exportSettlementReportToExcel(
    report: CommonSettlementReportDto[],
    filteredFieldsList: Map<string, string>,
    isCsv: boolean = false,
  ): Promise<string> {
    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    const worksheet: ExcelJS.Worksheet = workbook.addWorksheet('Settlement');

    this.setSettlementReportHeader(worksheet, filteredFieldsList);
    this.setSettlementReportRowsData(worksheet, report, filteredFieldsList);
    const reportBuffer: ExcelJS.Buffer = isCsv
      ? await workbook.csv.writeBuffer()
      : await workbook.xlsx.writeBuffer();

    return ArrayBufferEncoder.encode(reportBuffer);
  }

  private async exportSettlementReportToPDF(
    report: CommonSettlementReportDto[],
    filteredFieldsList: Map<string, string>,
  ): Promise<string> {
    const fonts: any = {
      Roboto: {
        bold: path.resolve('./assets/fonts/Roboto-Medium.ttf'),
        bolditalics: path.resolve('./assets/fonts/Roboto-MediumItalic.ttf'),
        italics: path.resolve('./assets/fonts/Roboto-Italic.ttf'),
        normal: path.resolve('./assets/fonts/Roboto-Regular.ttf'),
      },
    };

    const pageHeight: number = 5000;

    const header: string[] = [];
    for (const field of filteredFieldsList.keys()) {
      header.push(field);
    }
    const docDefinition: any = {
      content: [
        {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 8],
          text: `Payment Settlements Report`,
        },
        {
          layout: {
            defaultBorder: false,
            fillColor: (rowIndex: number, _node: any, _columnIndex: number): string => {
              return rowIndex % 2 === 0 ? '#f0f0f0' : '#ffffff';
            },
            fontSize: 5,
          },
          style: 'tableStyle',
          table: {
            body: [
              header,
              ...report.map((reportEntry: CommonSettlementReportDto) => {
                const values: any[] = [];
                for (const field of filteredFieldsList.values()) {
                  values.push(reportEntry[field] || '-');
                }

                return values;
              }),
            ],
            headerRows: 1,
          },
        },
      ],
      pageMargins: [40, 40, 40, 40],
      pageSize: {
        height: pageHeight,
        width: 17 * 120,
      },
      styles: {
        tableHeader: {
          bold: true,
          color: 'white',
          fillColor: '#242625',
          fontSize: 9,
        },
        tableStyle: {
          margin: [0, 0, 0, 0],
        },
      },
    };
    const printer: PdfMakePrinter = new PdfMakePrinter(fonts);
    const pdfDoc: any = printer.createPdfKitDocument(docDefinition);

    return new Promise(
      (
        resolve: (value: string | PromiseLike<string>) => void,
        reject: (value: string | PromiseLike<string>) => void,
      ) => {
        const chunks: any[] = [];
        pdfDoc.on('data', (chunk: any) => {
          chunks.push(chunk);
        });
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(chunks).toString('base64'));
        });
        pdfDoc.end();
      },
    );
  }

  private async exportSettlementPayments(
    exportDto: SettlementFilterRequestDto,
    businessId: string,
  ): Promise<TransactionSettlementReportInterface[]> {
    let filter: any = {
      $or: [],
      business_uuid: businessId,
      type: exportDto.payment_method,
    };
    let modifiedFrom: Date = null;
    let modifiedTo: Date = null;
    if (exportDto.start_date && exportDto.end_date) {
      modifiedFrom = new Date(exportDto.start_date);
      modifiedTo = new Date(exportDto.end_date);
      modifiedFrom.setUTCHours(0, 0, 0, 0);
      modifiedTo.setUTCHours(23, 59, 59, 999);
      if (modifiedFrom > modifiedTo) {
        throw new BadRequestException('Wrong date params');
      }
      filter = {
        ...filter,
        created_at: {
          $gt: modifiedFrom,
          $lt: modifiedTo,
        },
      };
    }
    if (exportDto.operation_type) {
      exportDto.operation_type = this.parsePaymentEnumStatus(exportDto.operation_type);
      filter = {
        ...filter,
        $or: [...filter.$or, { status: exportDto.operation_type }],
      };
    } else {
      filter = {
        ...filter,
        $or: [
          ...filter.$or,
          { status: PaymentStatusesEnum.Paid },
          { status: PaymentStatusesEnum.Refunded },
          { status: PaymentStatusesEnum.Cancelled },
        ],
      };
    }

    if (exportDto.currency) {
      filter = { ...filter, currency: exportDto.currency };
    }

    return this.transactionsModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          as: 'business',
          foreignField: '_id',
          from: 'businesses',
          localField: 'business_uuid',
        },
      },
      { $unwind: { path: '$business', preserveNullAndEmptyArrays: true } },
    ]);
  }

  private async storeFileInMedia(document: ExportedFileResultDto): Promise<string> {
    const url: string =
      `${environment.microUrlMedia}/api/storage/file?expiry=${environment.exportTransactionsDocExpiry}`;
    const bodyFormData: FormData = new FormData();
    bodyFormData.append(
      'file',
      Buffer.from(document.data, 'base64'),
      { filename: document.fileName },
    );

    const axiosRequestConfig: AxiosRequestConfig = {
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
      maxBodyLength: 524288000,
      method: 'POST',
      url: url,
    };

    let bodyLength: number = 0;
    try {
      bodyLength = bodyFormData.getLengthSync();
    } catch (e) {
      bodyLength = 0;
    }

    this.logger.log({
      bodyFormDataSize: bodyLength,
      fileName: document.fileName,
      message: 'Sending file to media',
    });

    const request: Observable<any> = await this.intercomService.request(axiosRequestConfig);

    return request
      .pipe(
        map((response: AxiosResponse<any>) => {
          this.logger.log({
            data: response.data,
            message: 'Received response from media call',
            url: url,
          });

          return response.data.url;
        }),
        catchError((error: AxiosError) => {
          const errorData: any = error.response?.data ? error.response.data : error.message;
          const errorStatus: number = error.response?.status ? error.response.status : HttpStatus.INTERNAL_SERVER_ERROR;
          this.logger.error({
            error: errorData,
            errorStatus: errorStatus,
            message: 'Failed response from media call',
            url: url,
          });

          throw new HttpException(errorData, errorStatus);
        }),
      )
      .toPromise();
  }

  private setSettlementReportHeader(
    worksheet: ExcelJS.Worksheet,
    filteredFieldsList: Map<string, string>,
  ): void {
    const columns: Array<{ header: string; width: number }> = [];
    for (const fieldText of filteredFieldsList.keys()) {
      columns.push({ header: fieldText, width: DEFAULT_COLUMN_WIDTH });
    }

    worksheet.columns = columns;
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setSettlementReportRowsData(
    worksheet: ExcelJS.Worksheet,
    report: CommonSettlementReportDto[],
    filteredFieldsList: Map<string, string>,
  ): void {
    for (const entry of report) {
      const row: any[] = [];
      for (const field of filteredFieldsList.values()) {
        row.push(entry[field]);
      }
      worksheet.addRow(row);
    }
  }

  private parsePaymentEnumStatus(status: string): PaymentStatusesEnum {
    switch (status) {
      case 'paid':
        return PaymentStatusesEnum.Paid;
      case 'refund':
        return PaymentStatusesEnum.Refunded;
      case 'cancel':
        return PaymentStatusesEnum.Cancelled;
      default:
        return null;
    }
  }

  private setRowFillColor(row: ExcelJS.Row, fillColor: string = REPORT_OVERALL_COLOR): void {
    row.eachCell((cell: ExcelJS.Cell) => {
      cell.fill = {
        fgColor: { argb: fillColor },
        pattern: 'darkVertical',
        type: 'pattern',
      };
    });
  }
}
