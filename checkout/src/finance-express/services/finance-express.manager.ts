import { Injectable, NotFoundException } from '@nestjs/common';
import { ExternalApiExecutor, HeadersHolderDto, PaymentMethodEnum } from '../../legacy-api';
import { InitRequestDto, InitResponseDto, SubmitRequestDto } from '../dto';
import { ChannelSetModel, ChannelSetService } from '../../channel-set';
import { CheckoutModel } from '../../checkout';
import { BusinessModel } from '../../business';
import { CheckoutBusinessService } from '../../business/services/checkout-business.service';
import { FlowModel, FlowService } from '../../flow';
import { FlowAccessChecker } from '../../flow/security';
import { AccessTokenPayload } from '@pe/nest-kit';
import { CacheManager } from '../../common';

const DEFAULT_TTL: number = 86400;
const HASH_TAG: string = '{checkout-finance-express}';

@Injectable()
export class FinanceExpressManager {
  constructor(
    private readonly checkoutBusinessService: CheckoutBusinessService,
    private readonly channelSetService: ChannelSetService,
    private readonly externalApiExecutor: ExternalApiExecutor,
    private readonly flowService: FlowService,
    private readonly flowAccessChecker: FlowAccessChecker,
    private readonly cacheManager: CacheManager,
  ) { }

  public async prepareInitData(
    headersHolder: HeadersHolderDto,
    paymentMethod: PaymentMethodEnum,
    initRequestDto: InitRequestDto,
  ): Promise<InitResponseDto> {
    const cacheKey: string =
      FinanceExpressManager.prepareInitCacheKey(initRequestDto.flow.channelSetId, initRequestDto.initData);
    const cacheData: string = await this.cacheManager.getData(cacheKey);

    if (cacheData) {
      return JSON.parse(cacheData);
    }

    const initData: InitResponseDto = await this.fetchInitData(headersHolder, paymentMethod, initRequestDto);

    if (initData) {
      await this.cacheManager.setData(cacheKey, JSON.stringify(initData), DEFAULT_TTL);
    }

    return initData;
  }

  public async doSubmit(
    headersHolder: HeadersHolderDto,
    paymentMethod: PaymentMethodEnum,
    submitRequest: SubmitRequestDto,
    user: AccessTokenPayload,
  ): Promise<any> {
    const flow: FlowModel = await this.flowService.findById(submitRequest?.payment?.flowId);
    if (!flow) {
      throw new NotFoundException('Flow not found');
    }

    await this.flowAccessChecker.checkFlowAccess(flow, user);

    return this.externalApiExecutor.externalFinanceExpressSubmit(
      headersHolder,
      flow.businessId,
      paymentMethod,
      submitRequest,
    );
  }

  public async invalidateCacheByBusiness(business: BusinessModel): Promise<void> {
    await business.populate('channelSets').execPopulate();
    let channelSet: ChannelSetModel;
    for (const businessChannelSet of business.channelSets) {
      channelSet = businessChannelSet as ChannelSetModel;
      if (!channelSet?.id) {
        continue;
      }

      await this.cacheManager.deleteKeysByPattern(`${HASH_TAG}-init-${channelSet.id}-*`);
    }
  }

  private async fetchInitData(
    headersHolder: HeadersHolderDto,
    paymentMethod: PaymentMethodEnum,
    initRequestDto: InitRequestDto,
  ): Promise<InitResponseDto> {
    const channelSet: ChannelSetModel = await this.channelSetService.findOneById(initRequestDto.flow.channelSetId);
    if (!channelSet) {
      throw new NotFoundException(`Channel set not found by id ${initRequestDto.flow.channelSetId}`);
    }
    await channelSet.populate('checkout').execPopulate();
    const checkout: CheckoutModel = channelSet.checkout;
    if (!checkout) {
      throw new NotFoundException(`Checkout is missing for channel set ${initRequestDto.flow.channelSetId}`);
    }
    const business: BusinessModel = await this.checkoutBusinessService.findOneById(checkout.businessId);
    if (!business) {
      throw new NotFoundException(`Business is missing for channel set ${initRequestDto.flow.channelSetId}`);
    }

    const initData: any = await this.externalApiExecutor.externalPaymentPreInitialization(
      headersHolder,
      business.id,
      paymentMethod,
      initRequestDto.initData,
    );

    return {
      flow: {
        country: business.businessDetail?.companyAddress?.country,
        currency: business.currency,
      },
      initData,
    };
  }

  private static prepareInitCacheKey(channelSetId: string, initData: any): string {
    return `${HASH_TAG}-init-${channelSetId}-${JSON.stringify(initData || { })}`;
  }
}
