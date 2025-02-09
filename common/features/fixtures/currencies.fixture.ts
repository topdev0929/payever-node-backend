import { BaseFixture } from '@pe/cucumber-sdk';

class CurrencyFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('currencies').insertOne({
      _id: 'currencyCode',
      name: 'currency',
      symbol: 'currenciesMap',
      rate: 123.45,
    });
  }
}

export = CurrencyFixture;
