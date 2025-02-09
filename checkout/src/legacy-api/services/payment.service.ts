import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Mutex } from '@pe/nest-kit/modules/mutex';
import { Model } from 'mongoose';
import { isDate } from 'rxjs/internal-compatibility';
import { PaymentSchemaName } from '../../mongoose-schema';
import { ActionWrapperDto } from '../dto';
import { PaymentActionDto } from '../dto/payment-action.dto';
import { CreatePaymentDto } from '../dto/payment-event';
import { PaymentAddressInterface, PaymentInterface } from '../interfaces';
import { PaymentModel } from '../models';
import { ExternalApiExecutor } from './external-api.executor';
import { PaymentListFilterDto } from '../dto/request/v1';

@Injectable()
export class PaymentService {
  constructor(
    @InjectModel(PaymentSchemaName) private readonly paymentModel: Model<PaymentModel>,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly mutex: Mutex,
  ) { }

  public async createOrUpdate(payment: PaymentInterface): Promise<PaymentModel> {
    const insertData: any = {
      original_id: payment.original_id,
      uuid: payment.uuid,
    };

    delete payment.original_id;
    delete payment.uuid;

    return this.mutex.lock(
      'checkout-payment',
      insertData.uuid,
      async () => this.paymentModel.findOneAndUpdate(
        { uuid: insertData.uuid },
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

  public async removeByUuid(uuid: string): Promise<void> {
    await this.paymentModel.findOneAndRemove({ uuid });
  }

  public async findByUuid(uuid: string): Promise<PaymentModel> {
    return this.paymentModel.findOne({ uuid });
  }

  public async findByBusinessAndFilter(businessId: string, filterDTO: PaymentListFilterDto): Promise<PaymentModel[]> {
    const filter: { [key: string]: string | { } } = {
      business_uuid: businessId,
    };

    if (filterDTO.paymentMethod) {
      filter.payment_type = filterDTO.paymentMethod;
    }

    if (filterDTO.currency) {
      filter.currency = filterDTO.currency;
    }

    if (filterDTO.status) {
      filter.status = filterDTO.status;
    }

    if (filterDTO.specificStatus) {
      filter.specific_status = filterDTO.specificStatus;
    }

    if (filterDTO.paymentId) {
      filter.original_id = filterDTO.paymentId;
    }

    if (filterDTO.date) {
      const date: Date = new Date(filterDTO.date);
      if (isDate(date) && date.toString() !== 'Invalid Date') {
        const dateFrom: number = date.setUTCHours(0, 0, 0);
        const dateTo: number = date.setUTCHours(23, 59, 59);

        filter.created_at = {
          $gt: new Date(dateFrom),
          $lt: new Date(dateTo),
        };
      }
    }

    if (filterDTO.dateLt) {
      filter.created_at = filter.created_at
        ? {
          ...(filter.created_at as object),
          $lt: filterDTO.dateLt,
        }
        : {
          $lt: filterDTO.dateLt,
        };
    }

    if (filterDTO.dateGt) {
      filter.created_at = filter.created_at
        ? {
          ...(filter.created_at as object),
          $gt: filterDTO.dateGt,
        }
        : {
          $gt: filterDTO.dateGt,
        };
    }

    if (filterDTO.totalLt) {
      filter.total = filter.total
        ? {
          ...(filter.total as object),
          $lt: filterDTO.totalLt,
        }
        : {
          $lt: filterDTO.totalLt,
        };
    }

    if (filterDTO.totalGt) {
      filter.total = filter.total
        ? {
          ...(filter.total as object),
          $gt: filterDTO.totalGt,
        }
        : {
          $gt: filterDTO.totalGt,
        };
    }

    return this.paymentModel.find(filter, null, { limit: filterDTO.limit, sort: { created_at: -1 }});
  }

  public async externalAction(
    payment: PaymentModel,
    actionWrapper: ActionWrapperDto,
  ): Promise<PaymentModel> {
    const updatedPayment: PaymentActionDto = await this.externalApiExecutor.externalAction(payment, actionWrapper);

    return this.paymentModel.findOneAndUpdate(
      { uuid: payment.uuid },
      updatedPayment as PaymentModel,
      { upsert: true, new: true },
    );
  }

  public static paymentDtoToModel(createPaymentDto: CreatePaymentDto): PaymentInterface {
    return {
      original_id: createPaymentDto.id,
      uuid: createPaymentDto.uuid,

      amount: createPaymentDto.amount,
      api_call_id: createPaymentDto.api_call_id,
      billing_address: createPaymentDto.address as PaymentAddressInterface,
      business_option_id: createPaymentDto.business_option_id,
      business_uuid: createPaymentDto.business
        ? createPaymentDto.business.uuid
        : null,
      channel: createPaymentDto.channel,
      channel_set_id: createPaymentDto.channel_set_id,
      channel_set_uuid: createPaymentDto.channel_set
        ? createPaymentDto.channel_set.uuid
        : null,
      channel_source: createPaymentDto.channel_source,
      channel_type: createPaymentDto.channel_type,
      color_state: createPaymentDto.color_state,
      created_at: createPaymentDto.created_at,
      currency: createPaymentDto.currency,
      customer_email: createPaymentDto.customer_email,
      customer_name: createPaymentDto.customer_email,
      customer_type: createPaymentDto.customer_type,
      delivery_fee: createPaymentDto.delivery_fee,
      down_payment: createPaymentDto.down_payment,
      items: createPaymentDto.items,
      merchant_name: createPaymentDto.business
        ? createPaymentDto.business.company_name
        : null,
      payment_details: createPaymentDto.payment_details
        ? createPaymentDto.payment_details
        : null,
      payment_fee: createPaymentDto.payment_fee,
      payment_issuer: createPaymentDto.payment_issuer,
      payment_type: createPaymentDto.payment_type,
      reference: createPaymentDto.reference,
      shipping_address: createPaymentDto.shipping_address
        ? createPaymentDto.shipping_address as PaymentAddressInterface
        : null,
      shipping_category: createPaymentDto.shipping_category
        ? createPaymentDto.shipping_category
        : null,
      shipping_method_name: createPaymentDto.shipping_method_name,
      shipping_option: createPaymentDto.shipping_option,
      shipping_option_name: createPaymentDto.shipping_option_name
        ? createPaymentDto.shipping_option_name
        : null,
      specific_status: createPaymentDto.specific_status,
      status: createPaymentDto.status,
      total: createPaymentDto.total,
      updated_at: createPaymentDto.updated_at,
    } as PaymentInterface;
  }
}
