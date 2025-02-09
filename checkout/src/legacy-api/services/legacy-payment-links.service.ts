import { Injectable } from '@nestjs/common';
import { PaymentCreateResultDto, CreatePaymentDto } from '../dto';
import { LegacyApiResponseTransformerService } from './index';
import { plainToClass } from 'class-transformer';
import { CreatePaymentDtoTransformer } from '../transformer/create-payment-dto.transformer';
import { CreatePaymentWrapperDto as V2CreatePaymentWrapperDto } from '../dto/request/v2';
import { CreatePaymentWrapperDto as V3CreatePaymentWrapperDto } from '../dto/request/v3';
import { ApiVersionEnum } from '../enum';
import { PaymentLinkResultDto, PaymentLinksQueryDto, PaymentLinkDto } from '../../payment-links/dto';
import { PaymentLinkTransformer } from '../../payment-links/transformers';
import { PaymentLinkService } from '../../payment-links/services/payment-link.service';
import { PaymentLinkModel } from '../../payment-links/models';
import * as dateFns from 'date-fns';

@Injectable()
export class LegacyPaymentLinksService {
  constructor(
    private readonly responseTransformer: LegacyApiResponseTransformerService,
    private readonly paymentLinkService: PaymentLinkService,
  ) { }

  public async createPaymentLinkFromCreatePaymentRequestDto(
    originalPaymentWrapper: any,
    createPayment: CreatePaymentDto,
    businessId: string,
    clientId: string,
    apiVersion: ApiVersionEnum,
  ): Promise<PaymentCreateResultDto> {
    const paymentLinkDto: PaymentLinkDto = {
      business_id: businessId,
      client_id: clientId,
      is_deleted: false,
      ...createPayment,
    };
    let redirectUrl: string = PaymentLinkTransformer.prepareRedirectUrl(createPayment);

    if (createPayment.privacy) {
      delete paymentLinkDto.salutation;
      delete paymentLinkDto.first_name;
      delete paymentLinkDto.last_name;
      delete paymentLinkDto.street;
      delete paymentLinkDto.street_number;
      delete paymentLinkDto.zip;
      delete paymentLinkDto.country;
      delete paymentLinkDto.region;
      delete paymentLinkDto.city;
      delete paymentLinkDto.address_line_2;

      delete paymentLinkDto.organization_name;
      delete paymentLinkDto.street_line_2;
      delete paymentLinkDto.street_name;
      delete paymentLinkDto.house_extension;

      delete paymentLinkDto.shipping_address;
      delete paymentLinkDto.email;
      delete paymentLinkDto.phone;
      delete paymentLinkDto.birthdate;
    }

    const paymentLinkModel: PaymentLinkModel = await this.paymentLinkService.createPaymentLinkLegacy(paymentLinkDto);
    redirectUrl = redirectUrl.replace('PAYMENT_LINK_ID', paymentLinkModel.id);

    const paymentLinkResult: PaymentLinkResultDto = plainToClass(PaymentLinkResultDto, paymentLinkModel.toObject());

    const createPaymentWrapper: V2CreatePaymentWrapperDto | V3CreatePaymentWrapperDto = apiVersion === ApiVersionEnum.v2
      ? CreatePaymentDtoTransformer.paymentLinkToV2CreatePaymentWrapperDtoTo(paymentLinkResult)
      : CreatePaymentDtoTransformer.paymentLinkToV3CreatePaymentWrapperDtoTo(paymentLinkResult);

    return this.responseTransformer.prepareCreatePaymentLinkResponse(
      originalPaymentWrapper,
      createPaymentWrapper,
      redirectUrl,
    );
  }

  public async getPaymentLinkList(
    businessId: string,
    query: PaymentLinksQueryDto,
    apiVersion: ApiVersionEnum,
  ): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    let conditions: any = {
      business_id: businessId,
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

    const paymentLinks: PaymentLinkModel[] = await this.paymentLinkService.getPaymentLinks(
      conditions,
      query,
      offset,
      limit,
    );

    const createPaymentWrapperList: V2CreatePaymentWrapperDto[] | V3CreatePaymentWrapperDto[] =
      apiVersion === ApiVersionEnum.v2
        ? paymentLinks.map((paymentLink: PaymentLinkModel) => {
          return CreatePaymentDtoTransformer.paymentLinkToV2CreatePaymentWrapperDtoTo(paymentLink);
        })
        : paymentLinks.map((paymentLink: PaymentLinkModel) => {
          return CreatePaymentDtoTransformer.paymentLinkToV3CreatePaymentWrapperDtoTo(paymentLink);
        });

    const total: number = await this.paymentLinkService.getPaymentLinksCount(conditions);
    const totalPages: number = Math.floor(total / limit) + 1;

    return {
      page,
      pageSize: limit,
      paymentLinks: createPaymentWrapperList,
      total,
      totalPages,
    };
  }

}
