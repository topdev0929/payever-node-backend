import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EventDispatcher } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { PaymentLinkSchemaName } from '../../mongoose-schema';
import { Model } from 'mongoose';
import { PaymentLinkModel } from '../models';
import { CreatePaymentDto } from '../../legacy-api/';
import { PaymentLinksQueryDto, PaymentLinkResultDto, PaymentLinkRequestDto, PaymentLinkDto } from '../dto';
import { PaymentLinkTransformer } from '../transformers';
import * as dateFns from 'date-fns';
import { BusinessModel } from '@pe/business-kit';
import { PaymentLinksEventsEnum } from '../enums';
import { environment } from '../../environments';
import { DEFAULT_CHECKOUT_LANGUAGE } from '../../common';

@Injectable()
export class PaymentLinkService {
  constructor(
    @InjectModel(PaymentLinkSchemaName) private readonly paymentLinkModel: Model<PaymentLinkModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async createPaymentLinkLegacy(paymentLinkDto: PaymentLinkDto): Promise<PaymentLinkModel> {
    return this.paymentLinkModel.create(paymentLinkDto);
  }

  public async createPaymentLink(
    paymentLinkDto: PaymentLinkRequestDto,
    businessId: string,
  ): Promise<PaymentLinkModel> {
    const paymentLinkModel: PaymentLinkModel = await this.paymentLinkModel.create({
      ...paymentLinkDto,
      business_id: businessId,
    });

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkCreated,
      paymentLinkModel,
    );

    return paymentLinkModel;
  }

  public async updatePaymentLinkLegacy(
    paymentLinkId: string,
    updatePayment: CreatePaymentDto,
  ): Promise<PaymentLinkResultDto> {
    const paymentLinkModel: PaymentLinkModel = await this.paymentLinkModel.findOneAndUpdate(
      {
        _id: paymentLinkId,
      },
      {
        $set: updatePayment,
      },
      {
        new: true,
      }
    );

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLinkModel,
    );

    return plainToClass(PaymentLinkResultDto, paymentLinkModel.toObject());
  }

  public async updatePaymentLinkIsActive(
    paymentLinkId: string,
    isActive: boolean,
  ): Promise<PaymentLinkModel> {
    const paymentLinkModel: PaymentLinkModel = await this.paymentLinkModel.findOneAndUpdate(
      {
        _id: paymentLinkId,
      },
      {
        $set: {
          is_active: isActive,
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLinkModel,
    );

    return paymentLinkModel;
  }

  public async updatePaymentLink(
    paymentLinkId: string,
    paymentLinkDto: PaymentLinkRequestDto,
    businessId: string,
  ): Promise<PaymentLinkModel> {
    paymentLinkDto = this.removeUndefinedFields(paymentLinkDto);
    const paymentLinkModel: PaymentLinkModel = await this.paymentLinkModel.findOneAndUpdate(
      {
        _id: paymentLinkId,
      },
      {
        $set: {
          ...paymentLinkDto,
          business_id: businessId,
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLinkModel,
    );

    return paymentLinkModel;
  }

  public async clonePaymentLink(
    paymentLinkModel: PaymentLinkModel,
  ): Promise<PaymentLinkModel> {
    const clonedPaymentLinkModel: PaymentLinkModel = await this.paymentLinkModel.create({
      ...paymentLinkModel.toObject(),
      _id: undefined,
      created_at: undefined,
    });

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkCreated,
      clonedPaymentLinkModel,
    );

    return clonedPaymentLinkModel;
  }

  public async getPaymentLinkById(paymentLinkId: string): Promise<PaymentLinkModel> {
    return this.paymentLinkModel.findById(paymentLinkId);
  }

  public async getPaymentLinkByApiCallId(apiCallId: string): Promise<PaymentLinkModel> {
    return this.paymentLinkModel.findOne({
      api_call_id: apiCallId,
    });
  }

  public async getPaymentLinkResult(
    paymentLinkId: string,
    convertKeys: boolean = true,
  ): Promise<PaymentLinkResultDto> {
    const paymentLink: PaymentLinkModel = await this.paymentLinkModel.findById(paymentLinkId);
    if (!paymentLink) {
      throw new NotFoundException(`Payment link with id ${paymentLinkId} not found`);
    }

    return this.preparePaymentLinkResult(paymentLink, convertKeys);

  }

  public async preparePaymentLinkResult(
    paymentLinkModel: PaymentLinkModel,
    convertKeys: boolean = true,
  ): Promise<PaymentLinkResultDto> {
    const paymentLinkResult: PaymentLinkResultDto = plainToClass(PaymentLinkResultDto, paymentLinkModel.toObject());

    const redirectUrl: string = PaymentLinkTransformer.prepareRedirectUrl(paymentLinkResult);
    paymentLinkResult.redirect_url = redirectUrl.replace('PAYMENT_LINK_ID', paymentLinkResult._id);

    return convertKeys ? PaymentLinkTransformer.convertKeysToCamelCase(paymentLinkResult) : paymentLinkResult;
  }

  public async getPaymentLinksPaginated(
    business: BusinessModel,
    query: PaymentLinksQueryDto,
  ): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    let conditions: any = {
      business_id: business._id,
      is_deleted: false,
    };

    if ( query.from ) {
      conditions = {
        ...conditions,
        created_at: { $gte: query.from },
      };
    }
    if ( query.to ) {
      conditions = {
        ...conditions,
        created_at: { $lt: dateFns.addDays(query.to, 1) },
      };
    }

    const paymentLinks: PaymentLinkModel[] = await this.getPaymentLinks(
      conditions,
      query,
      offset,
      limit,
    );

    const total: number = await this.getPaymentLinksCount(conditions);
    const totalPages: number = Math.floor(total / limit) + 1;

    return {
      page,
      pageSize: limit,
      paymentLinks: paymentLinks,
      total,
      totalPages,
    };

  }

  public async getPaymentLinks(
    conditions: any,
    query: PaymentLinksQueryDto,
    offset: number,
    limit: number,
  ): Promise<PaymentLinkModel[]> {
    return this.paymentLinkModel
      .find(conditions)
      .select(query.projection)
      .sort({ [query.orderBy]: query.direction })
      .skip(offset)
      .limit(limit);
  }

  public async getPaymentLinksCount(conditions: any): Promise<number> {
    return this.paymentLinkModel.countDocuments(conditions);
  }

  public async markPaymentLinkDeleted(paymentLinkId: string): Promise<void> {
    const paymentLink: PaymentLinkModel = await this.paymentLinkModel.findOneAndUpdate(
      {
        _id: paymentLinkId,
      },
      {
        $set: {
          is_deleted: true,
        },
      },
      {
        new: true,
      },
    );

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLink,
    );
  }

  public async updatePaymentAndStatusByApiCallId(apiCallId: string, paymentId: string): Promise<void> {
    if (!apiCallId || !paymentId) {
      return;
    }

    const paymentLinkModel = await this.paymentLinkModel.findOne(
      { api_call_id: apiCallId },
    );

    if (!paymentLinkModel.reusable) {
      paymentLinkModel.is_active = false;
    }
    paymentLinkModel.payment_id = paymentId;
    paymentLinkModel.transactions_count += 1;

    await paymentLinkModel.save();
    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLinkModel,
    );
  }

  public async increaseViewsCountById(paymentLinkId: string): Promise<void> {
    if (!paymentLinkId) {
      return;
    }

    const paymentLinkModel = await this.paymentLinkModel.findOneAndUpdate(
      { _id: paymentLinkId },
      { $inc: { views_count: 1 } },
      { new: true }
    );

    await this.eventDispatcher.dispatch(
      PaymentLinksEventsEnum.paymentLinkUpdated,
      paymentLinkModel,
    );
  }

  public async assignApiCall(paymentLink: PaymentLinkModel, apiCallId: string): Promise<void> {
    await this.paymentLinkModel.findOneAndUpdate(
      { _id: paymentLink.id },
      { $set: { api_call_id: apiCallId }},
    );
  }

  public checkPaymentLinkExpired(paymentLink: PaymentLinkModel): void {
    if (paymentLink.reusable) {
      return;
    }

    if (!paymentLink.expires_at && paymentLink.payment_id) {
      throw new ForbiddenException('Payment was already submitted');
    }

    if (!paymentLink.expires_at) {
      return;
    }

    if (paymentLink.expires_at <= new Date()) {
      throw new ForbiddenException('Payment link already expired');
    }
  }

  public async findPaymentLinksByConditions(conditions: any): Promise<PaymentLinkModel[]> {
    return this.paymentLinkModel.find(conditions);
  }

  public prepareErrorRedirectLink(message: string): string {
    const locale: string = DEFAULT_CHECKOUT_LANGUAGE;
    const redirectUrl: string =
      `${environment.frontendCheckoutWrapperMicroUrl}/${locale}/pay/static-finish/fail?message=${message}`;

    return redirectUrl;
  }

  private removeUndefinedFields(object: any): any {
    if (object === null) {
      return null;
    }

    for (const key of Object.keys(object)) {
      if (typeof object[key] === 'object') {
        object[key] = this.removeUndefinedFields(object[key]);
      } else {
        if (object[key] === undefined) {
          delete object[key];
        }
      }
    }

    return object;
  }

}
