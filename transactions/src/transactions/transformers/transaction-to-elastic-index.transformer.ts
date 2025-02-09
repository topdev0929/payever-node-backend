import { TransactionPackedDetailsInterface, AddressInterface, TransactionCartItemInterface } from '../interfaces';
import {
  TransactionFoldersIndexDto,
  ExportTransactionDto,
  ExportTransactionAddressDto,
  ExportTransactionItemDto,
} from '../dto';
import { TransactionModel } from '../models';
import { Logger } from '@nestjs/common';


export class TransactionTransformer {

  public static transactionToFoldersIndex(
    transaction: TransactionPackedDetailsInterface,
  ): TransactionFoldersIndexDto {
    let paymentDetails: any = { };
    try {
      paymentDetails = JSON.parse(transaction.payment_details);
    } catch (e) {
      Logger.log({
        context: 'TransactionTransformer',
        error: e.message,
        message: 'Error during unpack of payment details',
        transaction: transaction,
      });
    }

    let customerPspId: string = null;
    if (paymentDetails) {
      customerPspId =
        paymentDetails.pan_id ||
        paymentDetails.panId ||
        paymentDetails.usage_text ||
        paymentDetails.usageText ||
        paymentDetails.case_id ||
        paymentDetails.caseId ||
        paymentDetails?.application_no ||
        paymentDetails?.application_number ||
        paymentDetails?.applicationNumber ||
        paymentDetails?.applicationNo;
    }

    let transactionFoldersIndexDto: TransactionFoldersIndexDto = {
      anonymized: transaction.anonymized,
      channel: transaction.channel,
      channel_source: transaction.channel_source,
      channel_type: transaction.channel_type,
      created_at: transaction.created_at,
      currency: transaction.currency,
      customer_email: transaction.customer_email,
      customer_name: transaction.customer_name,
      customer_psp_id: customerPspId,
      example: transaction.example,
      id: transaction.uuid,
      merchant_email: transaction.merchant_email,
      merchant_name: transaction.merchant_name,
      original_id: transaction.original_id,
      plugin_version: transaction.plugin_version,
      reference: transaction.reference,
      seller_email: transaction.seller_email,
      seller_id: transaction.seller_id,
      seller_name: transaction.seller_name,
      specific_status: transaction.specific_status,
      status: transaction.status,
      total_left: transaction.total_left,
      type: transaction.type,
      uuid: transaction.uuid,
    };

    const itemWithThumbnail: TransactionCartItemInterface =
      transaction.items.find((item: TransactionCartItemInterface) => !!item.thumbnail);
    if (itemWithThumbnail) {
      transactionFoldersIndexDto = {
        ...transactionFoldersIndexDto,
        item_thumbnail: itemWithThumbnail.thumbnail,
      };
    }

    return transactionFoldersIndexDto;
  }

  public static transactionFoldersIndexToExportTransaction(
    transaction: TransactionFoldersIndexDto,
    transactionModel: TransactionModel,
  ): ExportTransactionDto {
    return {
      ...transaction,
      billing_address: TransactionTransformer.addressToFoldersAddress(transactionModel.billing_address),
      items: TransactionTransformer.itemsToFolderItems(transactionModel.items),
      payment_details: transactionModel.payment_details,
      shipping_address: TransactionTransformer.addressToFoldersAddress(transactionModel.shipping_address),
    };
  }

  private static addressToFoldersAddress(address: AddressInterface): ExportTransactionAddressDto {
    return address ? {
      city: address.city,
      company: address.company,
      country_name: address.country_name,
      phone: address.phone,
      street: address.street,
      zip_code: address.zip_code,
    } : undefined;
  }

  private static itemsToFolderItems(items: TransactionCartItemInterface[]): ExportTransactionItemDto[] {
    return items.map((item: TransactionCartItemInterface) => ({
      name: item.name,
      options: item.options,
      price: item.price,
      quantity: item.quantity,
      sku: item.sku,
      uuid: item.uuid,
      vat_rate: item.vat_rate,
    }));
  }
}
