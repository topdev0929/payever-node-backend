import { Injectable, NotFoundException, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
import { plainToClass } from 'class-transformer';

import {
  FolderDocumentsService,
  FoldersService,
  FolderDocument,
  FoldersElasticSearchService,
} from '@pe/folders-plugin';
import { ArchivedTransactionModel } from '../models';
import { ArchivedTransactionSchemaName } from '../schemas';
import {
  STORE_FIELDS,
  ANONYMIZED_TRANSACTION_FIELD,
  ARCHIVE_TRANSACTIONS_SALT,
  FILE_COLUMNS,
  GDPR_REMOVE_ARCHIVED_TRANSACTION_AFTER,
} from '../constants';
import { TransactionModel, AddressModel } from '../../transactions/models';
import { TransactionsService, ExporterService } from '../../transactions/services';
import { ARCHIVE_FOLDER_ID } from '../../transactions/folders.constants';
import { EsFolderItemInterface } from '@pe/folders-plugin/dist/src/interfaces';
import { keys } from 'lodash';
import { BusinessModel, BusinessSchemaName } from '../../business';
import { BusinessDto } from '../../business/dto';
import { environment } from '../../environments';
import { ExportTransactionDto, ExportedFileResultDto } from '../../transactions/dto';
import * as moment from 'moment/moment';
import { TransactionPackedDetailsInterface } from '../../transactions/interfaces';
import { MappingHelper } from '../../transactions/helpers';
import { FastifyReply } from 'fastify';
import { PaymentStatusesEnum } from '../../transactions/enum';

@Injectable()
export class ArchivedTransactionService {
  constructor(
    @InjectModel(ArchivedTransactionSchemaName)
    private readonly archivedTransactionModel: Model<ArchivedTransactionModel>,
    private readonly transactionsService: TransactionsService,
    private readonly folderDocumentsService: FolderDocumentsService,
    private readonly foldersService: FoldersService,
    private readonly foldersElasticSearchService: FoldersElasticSearchService,
    @InjectModel(BusinessSchemaName)
    private readonly businessModel: Model<BusinessModel>,
    private readonly exporterService: ExporterService,
  ) { }

  public async moveTransactionToArchive(transaction: TransactionModel): Promise<void> {
    const documents: EsFolderItemInterface[] =
      await this.foldersElasticSearchService.getDocumentsByServiceEntityId(transaction._id);
    if (documents) {
      for (const document of documents) {
        if (document.parentFolderId !== ARCHIVE_FOLDER_ID) {
          await this.folderDocumentsService.moveFolderItemToFolderByEsId(document._id, ARCHIVE_FOLDER_ID);
        }
      }
    }
  }

  public async anonymizeOldTransaction(transactionId: string): Promise<void> {
    let transaction: TransactionModel = await this.transactionsService.findModelByUuid(transactionId);
    if (!transaction) {
      throw new NotFoundException(`Transaction by id ${transactionId} not found`);
    }

    transaction = this.anonymizeTransactionData(transaction);
    await this.transactionsService.updateTransactionAnonymizedDataByUuid(transaction.uuid, transaction);

    await this.moveTransactionToArchive(transaction);
  }

  public async getOldBusinessTransactions(business: BusinessModel): Promise<TransactionModel[]> {
    const failedStatues: PaymentStatusesEnum[] = [
      PaymentStatusesEnum.Declined,
      PaymentStatusesEnum.Failed,
    ];
    const gdprDate: Date = this.parseDuration(
      business.transactionsRetentionPeriod || GDPR_REMOVE_ARCHIVED_TRANSACTION_AFTER
    );
    const failedGdprDate: Date = this.parseDuration(
      business.failedTransactionsRetentionPeriod || GDPR_REMOVE_ARCHIVED_TRANSACTION_AFTER
    );


    return this.transactionsService.findCollectionByParams(
      {
        $or: [
          { created_at: { $lte: gdprDate }, status: { $nin: failedStatues } },
          {
            created_at: { $lte: failedGdprDate }, status: { $in: failedStatues },
          },
        ],
        anonymized: { $ne: true },
        business_uuid: business._id,
      }
    );
  }

  public async restoreTransactionFromArchive(transaction: TransactionModel): Promise<void> {
    if (transaction.anonymized) {
      throw new BadRequestException(`Transaction with id ${uuid} anonymized already and couldn't be restored`);
    }
    const defaultRootFolder: FolderDocument =
      await this.foldersService.getBusinessScopeRootFolder(transaction.business_uuid);

    const documents: EsFolderItemInterface[] =
      await this.foldersElasticSearchService.getDocumentsByServiceEntityId(transaction._id);
    if (documents) {
      for (const document of documents) {
        if (document.parentFolderId !== ARCHIVE_FOLDER_ID) {
          await this.folderDocumentsService.moveFolderItemToFolderByEsId(document._id, defaultRootFolder._id);
        }
      }
    }
  }

  public async archiveBusinessTransactions(businessId: string): Promise<void> {
    const business: BusinessDto = await this.businessModel.findById(businessId) as BusinessDto;

    await this.archiveTransactionsOnBusinessDelete(business);
  }

  public async archiveTransactionsOnBusinessDelete(business: BusinessDto): Promise<void> {
    const transactions: TransactionModel[] = await this.transactionsService.findAll(business._id);
    const hashStr: string = `${business._id}${ARCHIVE_TRANSACTIONS_SALT}`;

    for (const transaction of transactions) {
      const anonymizedTransaction: TransactionModel = this.anonymizeTransactionData(transaction);
      await this.createArchivedTransaction(business._id, hashStr, anonymizedTransaction);

      await this.transactionsService.removeByUuid(transaction.uuid);
    }

    business.isDeleted = true;
    await this.businessModel.findOneAndUpdate(
      { _id: business._id },
      { $set: business },
    );
  }

  public async downloadArchivedTransactions(businessId: string, res: FastifyReply<any>): Promise<void> {
    const archivedTransactions: ArchivedTransactionModel[] =
      await this.archivedTransactionModel.find({ businessId: businessId });

    const fileName: string = `transactions-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`;
    const fileData: any = await this.exportTransactionsToFile(businessId, archivedTransactions);
    const exportedDocument: ExportedFileResultDto = {
      data: fileData,
      fileName,
    };

    if (archivedTransactions.length > environment.exportTransactionsCountDirectLimitMerchant) {
      const business: BusinessModel = await this.businessModel.findById(businessId);

      const documentLink: string = await this.exporterService.storeFileInMedia(exportedDocument);
      await this.exporterService.sendEmailToDownloadFileByLink(documentLink, business.userAccount.email);

      res.code(HttpStatus.ACCEPTED);
      res.send();
    } else {
      await this.returnDocument(exportedDocument, res);
    }
  }

  private parseDuration(value: string): Date {
    const duration: moment.Duration = moment.duration(value);

    return moment().subtract(duration).toDate();
  }

  private async exportTransactionsToFile(
    businessId: string,
    archivedTransactions: ArchivedTransactionModel[],
  ): Promise<void> {
    const exportedTransactions: ExportTransactionDto[] = [];
    const hashStr: string = `${businessId}${ARCHIVE_TRANSACTIONS_SALT}`;

    let maxItemsCount: number = 0;
    for (const archivedTransaction of archivedTransactions) {
      const planData: any = this.decrypt(archivedTransaction.encryptedData, hashStr);
      const restoredTransaction: ExportTransactionDto = plainToClass(ExportTransactionDto, planData);
      exportedTransactions.push(restoredTransaction);

      maxItemsCount = restoredTransaction.items.length > maxItemsCount
        ? restoredTransaction.items.length
        : maxItemsCount;
    }

    const fileName: string = `transactions-${moment().format('DD-MM-YYYY-hh-mm-ss')}.xlsx`;

    return this.exporterService.exportXLSX(
      exportedTransactions,
      fileName,
      'transactions',
      FILE_COLUMNS,
      maxItemsCount,
    );
  }

  private async createArchivedTransaction(
    businessId: string,
    hashStr: string,
    transaction: TransactionPackedDetailsInterface,
  ): Promise<ArchivedTransactionModel> {
    const archivedTransaction: ExportTransactionDto = this.transactionToExportTransaction(transaction);

    let data: any = {
      uuid: transaction.uuid,
    };
    for (const field of STORE_FIELDS) {
      data = {
        ...data,
        [field]: transaction[field],
      };
    }

    const encryptedData: string = this.encrypt(archivedTransaction, hashStr);

    return this.archivedTransactionModel.findOneAndUpdate(
      {
        uuid: transaction.uuid,
      },
      {
        $set: {
          businessId,
          data,
          encryptedData,
          uuid: transaction.uuid,
        },
        $setOnInsert: {
          _id: uuid(),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  private encrypt(data: any, passphrase: string): string {
    return CryptoJS.AES.encrypt(JSON.stringify(data), passphrase).toString();
  }

  private decrypt(encryptedString: string, passphrase: string): any {
    const bytes: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(encryptedString, passphrase);

    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  private anonymizeTransactionData(transaction: TransactionModel): TransactionModel {
    transaction.customer_name = ANONYMIZED_TRANSACTION_FIELD;
    transaction.customer_email = ANONYMIZED_TRANSACTION_FIELD;
    transaction.seller_name = ANONYMIZED_TRANSACTION_FIELD;
    transaction.seller_email = ANONYMIZED_TRANSACTION_FIELD;
    transaction.billing_address = this.anonymizeTransactionAddress(transaction.billing_address);
    transaction.shipping_address = this.anonymizeTransactionAddress(transaction.shipping_address);
    let unpackedPaymentDetails: any = { };
    try {
      unpackedPaymentDetails = transaction.payment_details ? JSON.parse(transaction.payment_details) : { };
    } catch (e) {
    }
    unpackedPaymentDetails = this.anonymizeObjectData(unpackedPaymentDetails);
    transaction.payment_details = JSON.stringify(unpackedPaymentDetails);

    transaction.anonymized = true;

    return transaction;
  }

  private anonymizeObjectData(data: { }): { } {
    for (const field of keys(data)) {
      data[field] = typeof data[field] === 'object'
        ? this.anonymizeObjectData(data[field])
        : ANONYMIZED_TRANSACTION_FIELD;
    }

    return data;
  }

  private anonymizeTransactionAddress(address: AddressModel): AddressModel {
    if (!address) {
      return undefined;
    }

    address.city = address.city ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.country = address.country ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.company = address.company ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.country_name = address.country_name ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.email = address.email ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.fax = address.fax ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.first_name = address.first_name ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.last_name = address.last_name ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.mobile_phone = address.mobile_phone ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.phone = address.phone ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.salutation = address.salutation ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.social_security_number = address.social_security_number ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.street = address.street ? ANONYMIZED_TRANSACTION_FIELD : undefined;
    address.zip_code = address.zip_code ? ANONYMIZED_TRANSACTION_FIELD : undefined;

    return address;
  }

  private transactionToExportTransaction(transaction: TransactionPackedDetailsInterface): ExportTransactionDto {
    let paymentDetails: any;
    try {
      paymentDetails = transaction.payment_details ? JSON.parse(transaction.payment_details) : null;
    } catch (e) {
      paymentDetails = { };
    }

    return {
      billing_address: transaction.billing_address,
      channel: transaction.channel,
      channel_source: transaction.channel_source,
      channel_type: transaction.channel_type,
      created_at: transaction.created_at,
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      customer_name: transaction.customer_name,
      customer_psp_id: MappingHelper.getCustomerPspId(paymentDetails),
      example: transaction.example,
      id: transaction.id,
      items: transaction.items,
      merchant_email: transaction.merchant_email,
      merchant_name: transaction.merchant_name,
      original_id: transaction.original_id,
      payment_details: transaction.payment_details,
      plugin_version: transaction.plugin_version,
      reference: transaction.reference,
      seller_email: transaction.seller_email,
      seller_id: transaction.seller_id,
      seller_name: transaction.seller_name,
      shipping_address: transaction.shipping_address,
      specific_status: transaction.specific_status,
      status: transaction.status,
      total_left: transaction.total,
      type: transaction.type,
      uuid: transaction.uuid,
    };
  }

  private async returnDocument(
    document: ExportedFileResultDto,
    res: FastifyReply<any>,
  ): Promise<void> {
    res.header('Content-Transfer-Encoding', `binary`);
    res.header(
      'Access-Control-Expose-Headers',
      `Content-Disposition,X-Suggested-Filename`,
    );
    res.header(
      'Content-disposition',
      `attachment;filename=${document.fileName}`,
    );
    res.send(document.data);
  }

}
