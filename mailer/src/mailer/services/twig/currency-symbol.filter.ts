import { CurrencyModel } from '@pe/common-sdk';

export class CurrencySymbolFilter {
  public static filter(code: string, currencies: CurrencyModel[]): string {
    const currency: CurrencyModel | undefined = currencies.find(
      (_currency: CurrencyModel) => _currency.symbol === code,
    );

    if (currency) {
      return currency.symbol;
    }

    return code;
  }
}
