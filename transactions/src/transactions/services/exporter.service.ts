// tslint:disable:no-in-misuse
import * as PdfMakePrinter from 'pdfmake/src/printer';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as FormData from 'form-data';
import * as ExcelJS from 'exceljs';
import { Model } from 'mongoose';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';

import { BusinessService } from '@pe/business-kit';
import {
  FoldersElasticSearchService,
  ElasticSearchCountResultsDto,
  PagingResultDto,
  ElasticFilterBodyInterface,
  FoldersService,
  FolderDocument,
} from '@pe/folders-plugin';
import { TransactionModel } from '../models';
import { ExportFormatEnum, PaymentStatusesEnum } from '../enum';
import { TransactionsFilter } from '../tools';
import {
  ExportedFileResultDto,
  ExportQueryDto,
  ExportTransactionsSettingsDto,
  ExportedTransactionsMailDto,
  TransactionFoldersIndexDto,
  ExportTransactionDto,
} from '../dto';
import { RabbitExchangesEnum, RabbitRoutingKeys } from '../../enums';
import { RabbitMqClient, IntercomService } from '@pe/nest-kit';
import { TransactionSchemaName } from '../schemas';
import { TransactionTransformer } from '../transformers';
import { BusinessModel } from '../../business';
import { environment } from '../../environments';
import { ExportSettlementQueryDto } from '../dto/export/export settlement-query.dto';
import { DEFAULT_COLUMN_WIDTH, REPORT_HEADER_COLOR, REPORT_OVERALL_COLOR } from '../constants';
import { TransactionHistoryEntryInterface, TransactionSettlementReportInterface } from '../interfaces';
import { ExporterDynamicService } from './exporter.dynamic.service';

type Column = { title: string; name: string };
type Columns = Column[];
type ProductColumn = { index: number; title: string; name: string };
type ProductColumns = ProductColumn[];
const shippingColumns: Columns = [
  { title: 'Shipping City', name: 'city' },
  { title: 'Shipping Company', name: 'company' },
  { title: 'Shipping Country', name: 'country_name' },
  { title: 'Shipping Phone', name: 'phone' },
  { title: 'Shipping Street', name: 'street' },
  { title: 'Shipping Zip', name: 'zip_code' },
];

const basicColumns: Columns = [
  { title: 'CHANNEL', name: 'channel' },
  { title: 'ID', name: 'original_id' },
  { title: 'TOTAL', name: 'total_left' },
];

const productColumnsFunc: any = (key: number): Array<{ index: number; title: string; name: string }> => [
  { index: key, title: `Lineitem${key + 1} identifier`, name: 'uuid' },
  { index: key, title: `Lineitem${key + 1} name`, name: 'name' },
  { index: key, title: `Lineitem${key + 1} variant`, name: 'options' },
  { index: key, title: `Lineitem${key + 1} price`, name: 'price' },
  { index: key, title: `Lineitem${key + 1} vat`, name: 'vat_rate' },
  { index: key, title: `Lineitem${key + 1} sku`, name: 'sku' },
  { index: key, title: `Lineitem${key + 1} quantity`, name: 'quantity' },
];

@Injectable()
export class ExporterService {
  private readonly defaultCurrency: string;

  constructor(
    private readonly elasticSearchService: FoldersElasticSearchService,
    private readonly businessService: BusinessService,
    private readonly configService: ConfigService,
    private readonly httpService: IntercomService,
    private readonly logger: Logger,
    private readonly rabbitClient: RabbitMqClient,
    @InjectModel(TransactionSchemaName)
    private readonly transactionsModel: Model<TransactionModel>,
    private readonly foldersService: FoldersService,
    private exporterDynamicService: ExporterDynamicService,
  ) {
    this.defaultCurrency = this.configService.get<string>('DEFAULT_CURRENCY');
  }

  public async exportSettlementPaymentsToJson(exportDto: ExportSettlementQueryDto): Promise<any[]> {
    const transactions: TransactionSettlementReportInterface[] = await this.exportSettlementPayments(exportDto);

    if (transactions?.length > 0) {
      return transactions.map((transaction: TransactionSettlementReportInterface) =>
        this.mapSettlementPayments(transaction),
      );
    } else {
      return [];
    }
  }

  public async exportSingleSettlementPayments(
    paymentId: string,
    businessId: string,
  ): Promise<TransactionSettlementReportInterface> {
    const transactions: TransactionSettlementReportInterface[] = await this.transactionsModel.aggregate([
      { $match: { uuid: paymentId } },
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
    if (
      (transactions?.length ?? 0) < 1 ||
      !(transactions[0].status === PaymentStatusesEnum.Paid || transactions[0].status === PaymentStatusesEnum.Refunded)
    ) {
      throw new NotFoundException(`Payment with paymentId ${paymentId} not found`);
    }
    if (transactions[0].business_uuid !== businessId) {
      throw new ForbiddenException(`You're not allowed to get the report`);
    }

    const mappedTransactions: any[] = transactions.map((transaction: TransactionSettlementReportInterface) =>
      this.mapSettlementPayments(transaction),
    );

    return mappedTransactions[0];
  }

  public async exportSettlementPaymentsToExcel(exportDto: ExportSettlementQueryDto): Promise<string> {
    const transactions: TransactionSettlementReportInterface[] = await this.exportSettlementPayments(exportDto);
    if (transactions.length === 0) {
      return '';
    }
    const fileName: string = `tmp_${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`;
    const options: ExcelJS.stream.xlsx.WorkbookStreamWriterOptions = {
      filename: fileName,
      zip: {
        store: false,
        zlib: {
          level: 9,
        },
      },
    } as any;

    const workbookWriter: ExcelJS.stream.xlsx.WorkbookWriter = new ExcelJS.stream.xlsx.WorkbookWriter(options);
    const worksheet: ExcelJS.Worksheet = workbookWriter.addWorksheet('Payments List');
    this.setSettlementReportHeader(worksheet);
    this.setSettlementReportRowsData(worksheet, transactions);
    worksheet.commit();
    await workbookWriter.commit();

    const documentBuffer: any = fs.readFileSync(fileName);
    fs.unlinkSync(fileName);

    return documentBuffer;
  }

  public async exportSettlementPaymentsToPDF(exportDto: ExportSettlementQueryDto): Promise<string> {
    const transactions: TransactionSettlementReportInterface[] = await this.exportSettlementPayments(exportDto);
    if (transactions.length === 0) {
      return '';
    }
    const fonts: any = {
      Roboto: {
        bold: path.resolve('./assets/fonts/Roboto-Medium.ttf'),
        bolditalics: path.resolve('./assets/fonts/Roboto-MediumItalic.ttf'),
        italics: path.resolve('./assets/fonts/Roboto-Italic.ttf'),
        normal: path.resolve('./assets/fonts/Roboto-Regular.ttf'),
      },
    };

    const pageHeight: number = 5000;
    const docDefinition: any = {
      content: [
        {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 8],
          text: `Payment Settlments Report from ${exportDto.start_date.toLocaleDateString(
            'en-US',
          )} to ${exportDto.end_date.toLocaleDateString('en-US')}`,
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
              [
                'payever Payment ID',
                'Mechant Order ID',
                'Operation Type',
                'Date',
                'Business Name',
                'Customer Email',
                'Customer Name',
                'Currency',
                'Execution Date',
                'Net Amount',
                'Fee',
                'Billing Country',
                'Billing City',
                'Billing Street',
                'Shipping Country',
                'Shipping City',
                'Shipping Street',
                'Application Number',
                'Finance ID',
                'Iban',
                'Pan ID',
              ],

              ...transactions.map((transaction: TransactionSettlementReportInterface) => [
                transaction.uuid ?? '-',
                transaction.reference ?? '-',
                this.getStatusText(transaction.status as PaymentStatusesEnum) ?? '-',
                transaction?.created_at?.toISOString() ?? '-',
                transaction?.business?.name ?? '-',
                transaction.customer_email ?? '-',
                transaction.customer_name ?? '-',
                transaction.currency ?? '-',
                this.getLastExecutionDate(transaction.history)?.toISOString() ?? '-',
                transaction.amount.toString() ?? '',
                transaction.payment_fee.toString() ?? '-',
                transaction.billing_address?.country_name ?? '-',
                transaction.billing_address?.city ?? '-',
                transaction.billing_address?.street ?? '-',
                transaction.shipping_address?.country_name ?? '-',
                transaction.shipping_address?.city ?? '-',
                transaction.shipping_address?.street ?? '-',

                (transaction?.payment_details?.application_no || transaction?.payment_details?.applicationNumber) ??
                '-',

                transaction?.payment_details?.finance_id ?? '-',

                (transaction?.payment_details?.iban || transaction?.payment_details?.bank_i_b_a_n) ?? '-',

                (transaction?.payment_details?.panId ||
                  transaction?.payment_details?.pan_id ||
                  transaction?.payment_details?.usageText ||
                  transaction?.payment_details?.caseId ||
                  transaction?.payment_details?.case_id) ??
                '-',
              ]),
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

  public async getTransactionsCount(
    exportDto: ExportQueryDto,
    businessId: string = null,
    userId: string = null,
  ): Promise<number> {
    const preparedFilter: ElasticFilterBodyInterface = await this.applyFolderFilter(
      exportDto.parentFolderId,
      businessId,
      userId,
    );
    if (!businessId && !userId) {
      exportDto.filters = TransactionsFilter.applyAdminFilters(exportDto.filters);
    }
    if (businessId) {
      exportDto.filters = TransactionsFilter.applyBusinessFilter(businessId, exportDto.filters, true);
      const business: BusinessModel = (await this.businessService.findOneById(businessId)) as unknown as BusinessModel;
      exportDto.currency = business ? business.currency : this.defaultCurrency;
    }
    if (userId) {
      exportDto.filters = TransactionsFilter.applyUserIdFilter(userId, exportDto.filters, true);
    }

    const result: ElasticSearchCountResultsDto = await this.elasticSearchService.getFilteredDocumentsCount(
      exportDto,
      preparedFilter,
    );

    return result.count;
  }

  public async exportTransactionsViaLink(exportSettings: ExportTransactionsSettingsDto): Promise<void> {
    let exportedDocument: ExportedFileResultDto;
    if (exportSettings.businessId) {
      exportedDocument = await this.exportBusinessTransactions(
        exportSettings.exportDto,
        exportSettings.businessId,
        exportSettings.transactionsCount,
      );
    } else if (exportSettings.userId) {
      exportedDocument = await this.exportUserTransactions(
        exportSettings.exportDto,
        exportSettings.userId,
        exportSettings.transactionsCount,
      );
    } else {
      exportedDocument = await this.exportAdminTransactions(exportSettings.exportDto, exportSettings.transactionsCount);
    }

    const documentLink: string = await this.storeFileInMedia(exportedDocument);
    await this.sendEmailToDownloadFileByLink(documentLink, exportSettings.sendEmailTo);
  }

  public async exportBusinessTransactions(
    exportDto: ExportQueryDto,
    businessId: string,
    totalCount: number,
  ): Promise<ExportedFileResultDto> {
    exportDto.filters = TransactionsFilter.applyBusinessFilter(businessId, exportDto.filters, true);
    const preparedFilter: ElasticFilterBodyInterface = await this.applyFolderFilter(
      exportDto.parentFolderId,
      businessId,
    );

    const business: BusinessModel = (await this.businessService.findOneById(businessId)) as unknown as BusinessModel;
    exportDto.currency = business ? business.currency : this.defaultCurrency;
    let businessName: string = `${exportDto.businessName.replace(/[^\x00-\x7F]/g, '')}`;
    businessName = businessName.replace(/\s/g, '-');
    const sheetName: string = moment().format('DD-MM-YYYY-hh-mm-ss');
    const fileName: string = `${businessName}-${sheetName}.${exportDto.format}`;

    return {
      data: await this.exportToFile(exportDto, fileName, totalCount, sheetName, preparedFilter),
      fileName,
    };
  }

  public async exportAdminTransactions(exportDto: ExportQueryDto, totalCount: number): Promise<ExportedFileResultDto> {
    const fileName: string = `transactions-${moment().format('DD-MM-YYYY-hh-mm-ss')}.${exportDto.format}`;
    exportDto.filters = TransactionsFilter.applyAdminFilters(exportDto.filters);
    const preparedFilter: ElasticFilterBodyInterface = await this.applyFolderFilter(null);

    return {
      data: await this.exportToFile(exportDto, fileName, totalCount, 'transactions', preparedFilter),
      fileName,
    };
  }

  public async exportUserTransactions(
    exportDto: ExportQueryDto,
    userId: string,
    totalCount: number,
  ): Promise<ExportedFileResultDto> {
    exportDto.filters = TransactionsFilter.applyUserIdFilter(userId, exportDto.filters, true);
    const fileName: string = `transactions-${moment().format('DD-MM-YYYY-hh-mm-ss')}.${exportDto.format}`;

    const preparedFilter: ElasticFilterBodyInterface = await this.applyFolderFilter(
      exportDto.parentFolderId,
      null,
      userId,
    );

    return {
      data: await this.exportToFile(exportDto, fileName, totalCount, 'transactions', preparedFilter),
      fileName,
    };
  }

  public async sendRabbitEvent(
    exportDto: ExportQueryDto,
    transactionsCount: number,
    sendEmailTo: string,
    fileName: string = '',
    businessId: string = null,
    userId: string = null,
  ): Promise<void> {
    const exportTransactionsSettings: ExportTransactionsSettingsDto = {
      businessId,
      exportDto,
      fileName,
      sendEmailTo: sendEmailTo,
      transactionsCount,
      userId,
    };

    await this.exporterDynamicService.startConsumer(exportTransactionsSettings);

    await this.rabbitClient.send(
      {
        channel: RabbitRoutingKeys.InternalTransactionExport,
        exchange: RabbitExchangesEnum.transactionsExport,
      },
      {
        name: RabbitRoutingKeys.InternalTransactionExport,
        payload: exportTransactionsSettings,
      },
    );
  }

  public async exportCSV(
    transactions: ExportTransactionDto[],
    columns: Array<{ title: string; name: string }>,
    maxItemsCount: number,
  ): Promise<any> {
    const productColumns: Array<{
      index: number;
      title: string;
      name: string;
    }> = ExporterService.getProductColumns(maxItemsCount);
    const data: string[][] = ExporterService.getTransactionData(transactions, productColumns, columns);

    const workbook: ExcelJS.Workbook = new ExcelJS.Workbook();
    const worksheet: ExcelJS.Worksheet = workbook.addWorksheet('sheet1');
    let addedCount: number = 0;
    const stepCount: number = 100;
    while (data.length > 0) {
      const addRecordsCount: number = data.length < stepCount ? data.length : stepCount;
      const records: string[][] = data.splice(0, addRecordsCount);
      worksheet.addRows(records);
      await this.sleep(2);
      addedCount += addRecordsCount;
    }

    const documentBuffer: ExcelJS.Buffer = await workbook.csv.writeBuffer();
    worksheet.destroy();

    return documentBuffer;
  }

  public async exportXLSX(
    transactions: ExportTransactionDto[],
    fileName: string,
    sheetName: string,
    columns: Array<{ title: string; name: string }>,
    maxItemsCount: number,
  ): Promise<any> {
    const productColumns: Array<{
      index: number;
      title: string;
      name: string;
    }> = ExporterService.getProductColumns(maxItemsCount);
    const data: string[][] = ExporterService.getTransactionData(transactions, productColumns, columns);

    const options: ExcelJS.stream.xlsx.WorkbookStreamWriterOptions = {
      filename: fileName,
      zip: {
        store: false,
        zlib: {
          level: 9,
        },
      },
    } as any;

    const workbookWriter: ExcelJS.stream.xlsx.WorkbookWriter = new ExcelJS.stream.xlsx.WorkbookWriter(options);
    const worksheet: ExcelJS.Worksheet = workbookWriter.addWorksheet(sheetName);

    for (let rowIndex: number = 0; rowIndex < data.length; rowIndex++) {
      const row: ExcelJS.Row = worksheet.addRow(data[rowIndex]);
      row.commit();
      if (rowIndex % 100 === 0) {
        await this.sleep(2);
      }
    }
    worksheet.commit();
    await workbookWriter.commit();

    const documentBuffer: any = fs.readFileSync(fileName);
    fs.unlinkSync(fileName);

    return documentBuffer;
  }

  public async storeFileInMedia(document: ExportedFileResultDto): Promise<string> {
    const fileBuffer: Buffer = await this.convertDocToBuffer(document);
    const url: string =
      `${environment.microUrlMedia}/api/storage/file?expiry=${environment.exportTransactionsDocExpiry}`;
    const bodyFormData: FormData = new FormData();
    bodyFormData.append('file', fileBuffer, { filename: document.fileName });

    const axiosRequestConfig: AxiosRequestConfig = {
      data: bodyFormData,
      headers: bodyFormData.getHeaders(),
      maxBodyLength: 524288000,
      method: 'POST',
      url: url,
    };

    let bodyLength: number;
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

    const request: Observable<any> = await this.httpService.request(axiosRequestConfig);

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

  public async sendEmailToDownloadFileByLink(documentLink: string, sendEmailTo: string): Promise<void> {
    this.logger.log({
      document: documentLink,
      message: 'Send email with link to file',
    });

    const emailData: ExportedTransactionsMailDto = {
      locale: 'en',
      templateName: 'transactions.exported_data_link',
      to: sendEmailTo,
      variables: {
        fileUrl: documentLink,
      },
    };

    await this.rabbitClient
      .send(
        {
          channel: RabbitRoutingKeys.PayeverEventUserEmail,
          exchange: RabbitExchangesEnum.asyncEvents,
        },
        {
          name: RabbitRoutingKeys.PayeverEventUserEmail,
          payload: emailData,
        },
      )
      .then();
  }

  private async exportSettlementPayments(
    exportDto: ExportSettlementQueryDto,
  ): Promise<TransactionSettlementReportInterface[]> {
    let filter: any = {
      $or: [],
      business_uuid: exportDto.business_id,
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

  private mapSettlementPayments(transaction: TransactionSettlementReportInterface): any {
    return {
      amount: transaction.amount,
      application_number:
        transaction?.payment_details?.application_no || transaction?.payment_details?.applicationNumber,
      billing_address_city: transaction?.billing_address?.city,
      billing_address_country_name: transaction?.billing_address?.country_name,
      billing_address_street: transaction?.billing_address?.street,
      business: transaction?.business?.name,
      created_at: transaction?.created_at?.toISOString(),
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      customer_name: transaction.customer_name,
      finance_id: transaction?.payment_details?.finance_id,
      iban: transaction?.payment_details?.iban || transaction?.payment_details?.bank_i_b_a_n,
      last_execution_date: this.getLastExecutionDate(transaction.history)?.toISOString(),
      pan_id:
        transaction?.payment_details?.panId ||
        transaction?.payment_details?.pan_id ||
        transaction?.payment_details?.usageText ||
        transaction?.payment_details?.caseId ||
        transaction?.payment_details?.case_id,
      payment_fee: transaction.payment_fee,
      reference: transaction.reference,
      shipping_address_city: transaction?.shipping_address?.city,
      shipping_address_country_name: transaction?.shipping_address?.country_name,
      shipping_address_street: transaction?.shipping_address?.street,
      status: this.getStatusText(transaction?.status as PaymentStatusesEnum),
      uuid: transaction.uuid,
    };
  }

  private async exportToFile(
    exportDto: ExportQueryDto,
    fileName: string,
    totalCount: number,
    sheetName: string,
    preparedFilter?: ElasticFilterBodyInterface,
  ): Promise<any> {
    let exportedCount: number = 0;
    const transactions: TransactionFoldersIndexDto[] = [];

    totalCount =
      totalCount > environment.exportTransactionsCountTotalLimit
        ? environment.exportTransactionsCountTotalLimit
        : totalCount;
    exportDto.limit = totalCount > 1000 ? 1000 : totalCount;
    const maxPagesCount: number = environment.exportTransactionsCountTotalLimit / 1000;

    while (exportedCount < totalCount) {
      const result: PagingResultDto = await this.elasticSearchService.getResult(exportDto, preparedFilter);

      for (const item of result.collection) {
        const transaction: TransactionFoldersIndexDto = item as any;
        transactions.push(transaction);
      }
      exportedCount += result.collection.length;
      exportDto.page++;
      if (exportDto.page > maxPagesCount || result.collection.length === 0) {
        break;
      }
      await this.sleep(2);
    }

    let maxItemsCount: number = 0;
    const exportedTransactions: ExportTransactionDto[] = [];
    for (const transaction of transactions) {
      const transactionModel: TransactionModel = await this.transactionsModel.findOne({
        uuid: transaction.uuid,
      }).lean();
      if (transactionModel) {
        const exportedTransaction: ExportTransactionDto =
          TransactionTransformer.transactionFoldersIndexToExportTransaction(transaction, transactionModel);

        if (exportedTransaction.items.length > maxItemsCount) {
          maxItemsCount = exportedTransaction.items.length;
        }
        exportedTransactions.push(exportedTransaction);
      }
    }

    const columns: Array<{ title: string; name: string }> = JSON.parse(exportDto.columns);

    switch (exportDto.format) {
      case ExportFormatEnum.csv: {
        return this.exportCSV(exportedTransactions, columns, maxItemsCount);
      }
      case ExportFormatEnum.xlsx: {
        return this.exportXLSX(exportedTransactions, fileName, sheetName, columns, maxItemsCount);
      }
      case ExportFormatEnum.pdf: {
        return this.exportPDF(exportedTransactions, columns, maxItemsCount);
      }
      default:
        return this.exportCSV(exportedTransactions, columns, maxItemsCount);
    }
  }

  private async exportPDF(
    transactions: ExportTransactionDto[],
    columns: Array<{ title: string; name: string }>,
    maxItemsCount: number,
  ): Promise<any> {
    const pageHeight: number = 5000;
    const productColumns: Array<{
      index: number;
      title: string;
      name: string;
    }> = ExporterService.getProductColumns(maxItemsCount);
    const data: any[][] = ExporterService.getTransactionData(transactions, productColumns, columns, true).map(
      (entity: any) => entity.map((e: string) => ({ text: e ? e.toString() : '', fontSize: 9 })),
    );

    const allColumns: any[] = [...shippingColumns, ...productColumns, ...columns];
    const cp: number = 100 / (allColumns.length + 2);
    const docDefinition: any = {
      content: [
        {
          bold: true,
          fontSize: 14,
          margin: [0, 10, 0, 8],
          text: 'Transactions',
        },
        {
          layout: {
            defaultBorder: false,
            fillColor: (rowIndex: number, _node: any, _columnIndex: number): string => {
              return rowIndex % 2 === 0 ? '#f0f0f0' : '#ffffff';
            },
          },
          style: 'tableStyle',
          table: {
            body: data,
            headerRows: 1,
            widths: [`${cp / 2}%`, `${cp}%`, `${cp / 2}%`, ...allColumns.map(() => `${cp}%`)],
          },
        },
      ],
      pageMargins: [40, 40, 40, 40],
      pageSize: {
        height: pageHeight,
        width: (allColumns.length + 2) * 120,
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
    const fonts: any = {
      Roboto: {
        bold: path.resolve('./assets/fonts/Roboto-Medium.ttf'),
        bolditalics: path.resolve('./assets/fonts/Roboto-MediumItalic.ttf'),
        italics: path.resolve('./assets/fonts/Roboto-Italic.ttf'),
        normal: path.resolve('./assets/fonts/Roboto-Regular.ttf'),
      },
    };

    const printer: PdfMakePrinter = new PdfMakePrinter(fonts);

    return printer.createPdfKitDocument(docDefinition, {
      compress: true,
      pdfVersion: '1.7ext3',
    });
  }

  private static emptyColumns(
    transactions: ExportTransactionDto[],
    productColumns: ProductColumns,
    columns: Columns,
  ): Columns {
    const filteredBasicColumns: Columns = basicColumns.filter((c: Column) =>
      !transactions.some((t: ExportTransactionDto) => t[c.name]),
    );
    const filteredShippingColumns: Columns = shippingColumns.filter(
      (c: Column) => {
        return !transactions.some((t: ExportTransactionDto) => (
          (t.shipping_address && c.name in t.shipping_address && t.shipping_address[c.name])
          || (t.billing_address && c.name in t.billing_address && t.billing_address[c.name])
      ));
      });
    const filteredProductColumns: ProductColumns = productColumns.filter(
      (c: ProductColumn) => {
        return !transactions.some((t: ExportTransactionDto) =>
          c.index in t.items && c.name in t.items[c.index] && t.items[c.index][c.name],
        );
      });
    const filteredColumns: Columns = columns.filter((c: Column) => {
      return !transactions.some((t: ExportTransactionDto) => t[c.name]);
    });

    return [
      ...filteredBasicColumns,
      ...filteredShippingColumns,
      ...filteredProductColumns,
      ...filteredColumns,
    ];
  }

  private static getProductColumns(maxItemsCount: number): any[] {
    let productColumns: any[] = [];

    for (let i: number = 0; i < maxItemsCount; i++) {
      productColumns = [...productColumns, ...productColumnsFunc(i)];
    }

    return productColumns;
  }

  // tslint:disable-next-line:cognitive-complexity
  private static getTransactionData(
    transactions: ExportTransactionDto[],
    productColumns: ProductColumns,
    columns: Columns,
    isFormatDate: boolean = false,
  ): any[] {
    const emptyColumnNames: string[] =
      this.emptyColumns(transactions, productColumns, columns).map((c: Column) => c.name);
    const notEmptyBasicColumns: Columns = basicColumns.filter((c: Column) => !emptyColumnNames.includes(c.name));
    const notEmptyShippingColumns: Columns = shippingColumns.filter((c: Column) => !emptyColumnNames.includes(c.name));
    const notEmptyProductColumns: ProductColumns =
       productColumns.filter((c: Column) => !emptyColumnNames.includes(c.name));
    const notEmptyColumns: Columns = columns.filter((c: Column) => !emptyColumnNames.includes(c.name));

    const header: string[] = [
      ...notEmptyBasicColumns.map((c: Column) => c.title),
      ...notEmptyShippingColumns.map((c: Column) => c.title),
      ...notEmptyProductColumns.map((c: ProductColumn) => c.title),
      ...notEmptyColumns.map((c: Column) => c.title),
    ];

    const exportedTransactions: any[] = transactions.map((t: ExportTransactionDto) => [
      ...notEmptyBasicColumns.map((c: Column) => t[c.name]),
      ...notEmptyShippingColumns.map((c: Column) => {
        return t.shipping_address && c.name in t.shipping_address
          ? t.shipping_address[c.name]
          : t.billing_address && c.name in t.billing_address
            ? t.billing_address[c.name]
            : '';
      }),
      ...notEmptyProductColumns.map((c: ProductColumn) => {
        return c.index in t.items && c.name in t.items[c.index]
          ? this.getProductValue(c.name, t.items[c.index][c.name])
          : '';
      }),
      ...notEmptyColumns.map((c: Column) =>
        isFormatDate && c.name === 'created_at' ? new Date(t[c.name]).toUTCString() : t[c.name] ? t[c.name] : '',
      ),
    ]);

    return [header, ...exportedTransactions];
  }

  private static getProductValue(field: string, value: string | any[]): string {
    if (field !== 'options') {
      return value as string;
    }

    if (!value || !Array.isArray(value)) {
      return '';
    }

    return value
      .map((item: { name: string; value: string }) => {
        return `${item.name}:${item.value}`;
      })
      .join(', ');
  }

  private async sleep(timeMs: number): Promise<void> {
    return new Promise((ok: any) =>
      setTimeout(
        () => {
          ok();
        },
        timeMs,
      ),
    );
  }

  private async applyFolderFilter(
    parentFolderId: string,
    businessId: string = null,
    userId: string = null,
    preparedFilters?: ElasticFilterBodyInterface,
  ): Promise<ElasticFilterBodyInterface> {
    if (!parentFolderId) {
      let folderDocument: FolderDocument;
      if (businessId) {
        folderDocument = await this.foldersService.getBusinessScopeRootFolder(businessId);
      }
      if (userId) {
        folderDocument = await this.foldersService.getUserScopeRootFolder(userId);
      }
      if (folderDocument) {
        parentFolderId = folderDocument.id;
      }
    }

    const elasticFilters: ElasticFilterBodyInterface = preparedFilters
      ? preparedFilters
      : this.elasticSearchService.createFiltersBody();

    if (parentFolderId) {
      elasticFilters.must.push({
        match_phrase: { parentFolderId: parentFolderId },
      });
    }
    elasticFilters.must.push({
      match_phrase: { isFolder: false },
    });

    return elasticFilters;
  }

  private setSettlementReportHeader(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns = [
      { header: 'payever Payment ID', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Mechant Order ID', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Operation Type', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Date', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Business Name', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Customer Email', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Customer Name', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Currency', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Execution Date', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Net Amount', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Fee', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Billing Country', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Billing City', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Billing Street', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Shipping Country', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Shipping City', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Shipping Street', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Application Number', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Finance ID', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Iban', width: DEFAULT_COLUMN_WIDTH},
      { header: 'Pan ID', width: DEFAULT_COLUMN_WIDTH},
    ];
    this.setRowFillColor(worksheet.lastRow, REPORT_HEADER_COLOR);
  }

  private setSettlementReportRowsData(
    worksheet: ExcelJS.Worksheet,
    transactions: TransactionSettlementReportInterface[],
  ): void {
    transactions.forEach((transaction: TransactionSettlementReportInterface) => {
      worksheet.addRow([
        transaction.uuid,
        transaction.reference,
        this.getStatusText(transaction.status as PaymentStatusesEnum),
        transaction?.created_at?.toISOString(),
        transaction?.business?.name,
        transaction.customer_email,
        transaction.customer_name,
        transaction.currency,
        this.getLastExecutionDate(transaction.history)?.toISOString(),
        transaction.amount,
        transaction.payment_fee,
        transaction.billing_address?.country_name,
        transaction.billing_address?.city,
        transaction.billing_address?.street,
        transaction.shipping_address?.country_name,
        transaction.shipping_address?.city,
        transaction.shipping_address?.street,

        transaction?.payment_details?.application_no || transaction?.payment_details?.applicationNumber,

        transaction?.payment_details?.finance_id,

        transaction?.payment_details?.iban || transaction?.payment_details?.bank_i_b_a_n,

        transaction?.payment_details?.panId ||
        transaction?.payment_details?.pan_id ||
        transaction?.payment_details?.usageText ||
        transaction?.payment_details?.caseId ||
        transaction?.payment_details?.case_id,
      ]);
    });
  }

  private getLastExecutionDate(histories: TransactionHistoryEntryInterface[]): Date {
    return (histories ?? [])[(histories?.length ?? 0) - 1]?.created_at;
  }

  private getStatusText(status: PaymentStatusesEnum): string {
    switch (status) {
      case PaymentStatusesEnum.New:
        return 'New';
      case PaymentStatusesEnum.Accepted:
        return 'Accepted';
      case PaymentStatusesEnum.Cancelled:
        return 'Cancelled';
      case PaymentStatusesEnum.Declined:
        return 'Declined';
      case PaymentStatusesEnum.Failed:
        return 'Failed';
      case PaymentStatusesEnum.InProcess:
        return 'In Process';
      case PaymentStatusesEnum.Paid:
        return 'Paid';
      case PaymentStatusesEnum.Refunded:
        return 'Refunded';
      default:
        return '';
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

  private async convertDocToBuffer(document: ExportedFileResultDto): Promise<Buffer> {
    if (Buffer.isBuffer(document.data)) {
      return document.data;
    }

    return new Promise((resolve: any, reject: any) => {
      try {
        const chunks: any[] = [];

        document.data.on('data', (chunk: any) => {
          chunks.push(chunk);
        });

        document.data.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        document.data.end();
      } catch (e) {
        reject(e);
      }
    });
  }
}
