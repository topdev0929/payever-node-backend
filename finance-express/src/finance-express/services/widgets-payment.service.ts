import { BadRequestException, Injectable } from '@nestjs/common';
import { CalculateRatesDto } from '../dto';
import { WidgetTypesEnum } from '../enums';
import { ThirdPartyCallerService, CacheManager } from '../services';
import { PaymentOptionInterface, WidgetModel } from '../interfaces';

@Injectable()
export class WidgetsPaymentService {
  constructor(
    private readonly thirdPartyCallerService: ThirdPartyCallerService,
    private readonly cacheManager: CacheManager,
  ) { }

  public async requestRates(
    businessId: string,
    calculateRatesDto: CalculateRatesDto,
    widget?: WidgetModel,
  ): Promise<any> {
    calculateRatesDto = this.fillCalculationRatesDto(calculateRatesDto, widget);
    this.validateCalculationRatesDto(calculateRatesDto);

    const cacheKey: string = WidgetsPaymentService.prepareCacheKey(businessId, calculateRatesDto);
    const cachedData: string = await this.cacheManager.getData(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const ratesResult: any = await this.thirdPartyCallerService.getRates(businessId, calculateRatesDto);

    if (ratesResult && ratesResult.credit) {
      await this.cacheManager.setData(
        cacheKey,
        JSON.stringify(ratesResult),
        4 * 60 * 60,
      );
    }

    return ratesResult;
  }

  private static prepareCacheKey(
    businessId: string,
    calculateRatesDto: CalculateRatesDto,
  ): string {
    return `finance_express_rates_${businessId}_${JSON.stringify(calculateRatesDto)}`;
  }

  private fillCalculationRatesDto(
    calculateRatesDto: CalculateRatesDto,
    widget?: WidgetModel,
  ): CalculateRatesDto {
    let calculateRates: CalculateRatesDto =  {
      ...calculateRatesDto,
      code: calculateRatesDto.code ? calculateRatesDto.code : '',
      reference: calculateRatesDto.reference ? calculateRatesDto.reference : '',
      widgetPlaced: calculateRatesDto.widgetPlaced ? calculateRatesDto.widgetPlaced : '',
    };

    if (widget) {
      const payment: PaymentOptionInterface =
        widget.payments.find(
          (item: PaymentOptionInterface) => item.paymentMethod === calculateRatesDto.paymentOption);

      calculateRates = {
        ...calculateRates,
        connectionId: payment && payment.connectionId ? payment.connectionId : calculateRatesDto.connectionId,
        widgetType: widget.type
          ? widget.type as WidgetTypesEnum : calculateRatesDto.widgetType
            ? calculateRatesDto.widgetType : null,
      };
    }

    return calculateRates;
  }

  private validateCalculationRatesDto(calculateRatesDto: CalculateRatesDto): void {
    if (!calculateRatesDto.connectionId) {
      throw new BadRequestException('connectionId not defined');
    }
    if (!calculateRatesDto.widgetType) {
      throw new BadRequestException('widgetType not defined');
    }
  }
}
