/* tslint:disable:object-literal-sort-keys */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { Model } from 'mongoose';
import { PaymentSchemaName } from '../schemas';
import { PaymentModel } from '../models';
import { PaymentEventAddressDto, PaymentEventDto, PaymentEventItemDto } from '../dto/payment-event';
import { PaymentAddressInterface, PaymentInterface, PaymentItemInterface } from '../interfaces';
import { TransactionsPaymentExportDto } from '../dto/transactions-event';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentSchemaName) private readonly paymentModel: Model<PaymentModel>,
    private readonly mutex: Mutex,
  ) { }

  public async updateCustomerData(payment: TransactionsPaymentExportDto): Promise<void> {
    if (!payment.customer || !payment.customer.email) {
      return;
    }
    await this.paymentModel.updateOne({
      _id: payment.id,
    }, {
      $set: {
        userId: payment.user.id,
        customerName: payment.customer ? payment.customer.name : null,
        customerEmail: payment.customer ? payment.customer.email : null,
      },
    });

  }

  public async createOrUpdateFromEventDto(paymentDto: PaymentEventDto): Promise<PaymentModel> {
    const payment: PaymentInterface = this.paymentEventDtoToModel(paymentDto);

    const insertData: any = {
      _id: paymentDto.uuid,
      originalId: payment.originalId,
    };

    delete payment.originalId;

    return this.mutex.lock(
      'checkout-analytics-payment',
      insertData._id,
      async () => this.paymentModel.findOneAndUpdate(
        { _id: insertData._id },
        {
          $set: payment,
          $setOnInsert: insertData,
        },
        {
          new: true,
          upsert: true,
        },
      ),
    );
  }

  public async findLastTransactionsByBusinessAndPaymentMethod(
    businessId: string,
    paymentMethod: string,
    limit: number = 2,
  ): Promise<PaymentModel[]> {
    return this.paymentModel.find(
      {
        businessId,
        paymentMethod,
      },
      { },
      {
        sort: { createdAt: -1 },
      },
    ).limit(limit);
  }

  public async findPaymentsMethodsByBusiness(
    businessId: string,
  ): Promise<PaymentModel[]> {

    return this.paymentModel.aggregate([
      {
        $match: {
          'businessId': {
            $eq: businessId,
          },
        },
      },
      {
        $group: {
          _id: {
            'paymentMethod': '$paymentMethod',
          },
        },
      },
      {
        $project: {
          _id: 0,
          paymentMethod: '$_id.paymentMethod',
        },
      },
    ]);
  }

  public async removeById(id: string): Promise<void> {
    await this.paymentModel.findOneAndRemove({ _id: id });
  }

  public async findLastTransactionsByPaymentMethod(paymentMethod: string, limit: number = 2): Promise<PaymentModel[]> {
    return this.paymentModel.find(
      {
        paymentMethod,
      },
      { },
      {
        sort: { createdAt: -1 },
      },
    ).limit(limit);
  }

  public async findTransactionsByCreatedAtRange(from: Date, to: Date): Promise<PaymentModel[]> {
    return this.paymentModel.find(
      {
        createdAt: { $gte: from, $lte: to },
      },
      { },
      {
        sort: { createdAt: 1 },
      },
    );
  }

  private paymentEventDtoToModel(paymentDto: PaymentEventDto): PaymentInterface {
    return {
      amount: paymentDto.amount,
      deliveryFee: paymentDto.delivery_fee,
      downPayment: paymentDto.down_payment,
      total: paymentDto.total,
      userId: paymentDto.user_uuid,
      businessId: paymentDto.business?.uuid,
      businessName: paymentDto.business?.company_name,
      channel: paymentDto.channel,
      channelSetId: paymentDto.channel_set?.uuid,
      currency: paymentDto.currency,
      originalId: paymentDto.id,
      customerEmail: paymentDto.customer_email,
      customerName: paymentDto.customer_name,
      customerType: paymentDto.customer_type,
      paymentMethod: paymentDto.payment_type,
      reference: paymentDto.reference,
      specificStatus: paymentDto.specific_status,
      status: paymentDto.status,

      billingAddress: this.prepareAddress(paymentDto.address),
      shippingAddress: this.prepareAddress(paymentDto.shipping_address),

      items: this.prepareItems(paymentDto.items),

      createdAt: paymentDto.created_at,
      updatedAt: paymentDto.updated_at,

      forceRedirect: paymentDto.force_redirect,
    };
  }

  private prepareAddress(paymentAddressDto: PaymentEventAddressDto): PaymentAddressInterface {
    if (!paymentAddressDto) {
      return null;
    }

    return {
      city: paymentAddressDto.city,
      country: paymentAddressDto.country,
      countryName: paymentAddressDto.country_name,
      street: paymentAddressDto.street,
      zipCode: paymentAddressDto.zip_code,
    };
  }

  private prepareItems(paymentItemDTOs: PaymentEventItemDto[]): PaymentItemInterface[] {
    if (!paymentItemDTOs || !paymentItemDTOs.length) {
      return null;
    }

    return paymentItemDTOs.map((itemDTO: PaymentEventItemDto): PaymentItemInterface => {
      return {
        createdAt: itemDTO.created_at,
        extraData: itemDTO.extra_data,
        identifier: itemDTO.identifier,
        name: itemDTO.name,
        options: itemDTO.options,
        price: itemDTO.price,
        priceNet: itemDTO.price_net,
        productId: itemDTO.product_uuid,
        quantity: itemDTO.quantity,
        sku: itemDTO.sku,
        updatedAt: itemDTO.updated_at,
        vatRate: itemDTO.vat_rate,
      };
    });
  }
}
