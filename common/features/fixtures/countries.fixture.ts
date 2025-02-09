import { BaseFixture } from '@pe/cucumber-sdk';

class CountryFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('countries').insertOne({
      _id: 'countryCode',
      capital: 'capital',
      continent: 'continent',
      currencies: ['currency'],
      flagEmoji: 'emoji',
      flagUnicode: 'emojiU',
      languages: ['en', 'ua'],
      name: 'name',
      nativeName: 'native',
      phoneCode: 1234,
    });
  }
}

export = CountryFixture;
