import { BaseFixture } from '@pe/cucumber-sdk';

class LanguagesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('languages').insertOne({
      _id: 'language',
      englishName: 'en',
      name: 'English',
    });
  }
}

export = LanguagesFixture;
