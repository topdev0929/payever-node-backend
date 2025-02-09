import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk/module';

import { CurrencyDto, CurrencyModel, CurrencyService } from '@pe/common-sdk';

class Currencyixture extends BaseFixture {
  private readonly currencyModel: Model<CurrencyModel> =
    this.application.get('CurrencyModel');

  public async apply(): Promise<void> {
    await this.currencyModel.create({
      _id: 'EUR',
      name: 'EUR',
      symbol: 'EUR',
      rate: 5,
    } as any);
  }
}

export = Currencyixture;
