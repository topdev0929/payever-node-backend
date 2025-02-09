import { Injectable } from '@nestjs/common';
import { PaymentItemDto, PaymentMailDto, TransactionCartItemDto } from '../../dto';
import { AbstractPaymentMailDtoConverter } from './abstract-payment-mail-dto.converter';
import { TransactionChangedDto } from '../../dto/checkout-rabbit';

@Injectable()
export class OderInvoiceMailDtoConverter extends AbstractPaymentMailDtoConverter{
  public static fromTransactionChangedDto(paymentSubmittedDto: TransactionChangedDto): PaymentMailDto {
    return {
      cc: [],
      to: paymentSubmittedDto.payment.customer_email,

      template_name: 'order_invoice_template',

      business: {
        uuid: paymentSubmittedDto.payment.business.uuid,
      },
      payment: {
        address: paymentSubmittedDto.payment.address,
        id: paymentSubmittedDto.payment.id,
        uuid: paymentSubmittedDto.payment.uuid,

        amount: paymentSubmittedDto.payment.amount,
        created_at: paymentSubmittedDto.payment.created_at,
        currency: paymentSubmittedDto.payment.currency,
        reference: paymentSubmittedDto.payment.reference,
        total: paymentSubmittedDto.payment.total,
        vat_rate: OderInvoiceMailDtoConverter.calculateTaxAmount(paymentSubmittedDto.payment.items),

        customer_email: paymentSubmittedDto.payment.customer_email,
        customer_name: paymentSubmittedDto.payment.customer_name,
        delivery_fee: paymentSubmittedDto.payment.delivery_fee,
        payment_option: {
          payment_details: paymentSubmittedDto.payment.payment_details,
          payment_issuer: paymentSubmittedDto.payment.payment_issuer,
          payment_method: paymentSubmittedDto.payment.payment_type,
        },
      },

      payment_items: paymentSubmittedDto.payment.items.map((item: TransactionCartItemDto): PaymentItemDto => ({
        name: item.name,
        options: item.options,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
        uuid: item.uuid,
        vat_rate: item.vat_rate,
      })),
    };
  }
}
