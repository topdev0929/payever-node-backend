import { Injectable } from '@nestjs/common';
import { CalculateRatesDto } from '../dto';

@Injectable()
export class ServiceUrlRetriever {
  constructor(
  ) { }

  public composeActionUrl(
    url: string,
    businessId: string,
    calculateRates: CalculateRatesDto,
  ): string {
    let actionUrl: string = url;

    actionUrl = actionUrl.replace(':businessId', businessId);
    if (calculateRates) {
      for (const param of Object.keys(calculateRates)) {
        if (typeof calculateRates[param] === 'string') {
          actionUrl = actionUrl.replace(':' + param, calculateRates[param]);
        }
      }
    }

    return actionUrl;
  }
}
