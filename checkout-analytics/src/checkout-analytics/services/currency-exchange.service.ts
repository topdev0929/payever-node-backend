import { Injectable } from '@nestjs/common';
import { CurrencyModel, CurrencyService } from '@pe/common-sdk';
import { DEFAULT_CURRENCY } from '../constants';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    private readonly currencyService: CurrencyService,
  ) { }

  public async exchangeVolumeTotal(total: number, currency: string): Promise<number> {
    if (currency === DEFAULT_CURRENCY) {
      return total;
    }

    return this.exchange(total, currency);
  }

  public async exchange(
    value: number,
    sourceCurrency: string,
    targetCurrency: string = 'EUR',
  ): Promise<number> {
    const targetRate: CurrencyModel = await this.currencyService.getCurrencyByCode(targetCurrency.toUpperCase());
    const sourceRate: CurrencyModel = await this.currencyService.getCurrencyByCode(sourceCurrency.toUpperCase());

    return value * targetRate.rate / sourceRate.rate;
  }
}
