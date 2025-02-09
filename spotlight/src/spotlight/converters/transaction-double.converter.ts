import { Injectable } from '@nestjs/common';

@Injectable()
export class TransactionDoubleConverter {
  public static unpack(transaction: any): any {
    transaction.amount = transaction.amount / 100;
    transaction.total = transaction.total / 100;
    transaction.delivery_fee = transaction.delivery_fee
      ? transaction.delivery_fee / 100
      : transaction.delivery_fee
    ;
    transaction.down_payment = transaction.down_payment
      ? transaction.down_payment / 100
      : transaction.down_payment
    ;
    transaction.payment_fee = transaction.payment_fee
      ? transaction.payment_fee / 100
      : transaction.payment_fee
    ;

    for (const item of transaction.items) {
      this.handleItemPack(item);
    }

    for (const record of transaction.history) {
      record.amount = record.amount
        ? record.amount / 100
        : record.amount
      ;
    }

    return transaction;
  }

  private static handleItemPack(item: any): void {
    item.price = item.price
      ? item.price / 100
      : item.price
    ;
    item.price_net = item.price_net
      ? item.price_net / 100
      : item.price_net
    ;
    item.vat_rate = item.vat_rate
      ? item.vat_rate / 100
      : item.vat_rate
    ;
    item.fixed_shipping_price = item.fixed_shipping_price
      ? item.fixed_shipping_price / 100
      : item.fixed_shipping_price
    ;
    item.shipping_price = item.shipping_price
      ? item.shipping_price / 100
      : item.shipping_price
    ;
    item.shipping_settings_rate = item.shipping_settings_rate
      ? item.shipping_settings_rate / 100
      : item.shipping_settings_rate
    ;
    item.weight = item.weight
      ? item.weight / 100
      : item.weight
    ;
  }
}
