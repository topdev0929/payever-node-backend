import { Injectable } from '@nestjs/common';
import { CurrencyModel, CurrencyService } from '@pe/common-sdk';

@Injectable()
export class CurrencyExchangeService {
  constructor(
    private readonly currencyService: CurrencyService,
  ) { }

  public async exchangePaymentMethodLimits(
    targetCurrency: string,
    amountLimits: { [currency: string]: number },
  ): Promise<number> {
    let sourceCurrency: string = 'EUR';

    if (amountLimits.hasOwnProperty(targetCurrency)) {
      return amountLimits[targetCurrency];
    }

    if (!amountLimits.hasOwnProperty(sourceCurrency)) {
      sourceCurrency = Object.keys(amountLimits).shift();
    }

    const value: number = await this.exchange(amountLimits[sourceCurrency], sourceCurrency, targetCurrency);

    return Number((value).toFixed(2));
  }

  public async exchange(
    value: number,
    sourceCurrency: string,
    targetCurrency: string,
  ): Promise<number> {
    const targetRate: CurrencyModel = await this.currencyService.getCurrencyByCode(targetCurrency.toUpperCase());
    const sourceRate: CurrencyModel = await this.currencyService.getCurrencyByCode(sourceCurrency.toUpperCase());

    return value * (targetRate?.rate || 1) / (sourceRate?.rate || 1);
  }
}
