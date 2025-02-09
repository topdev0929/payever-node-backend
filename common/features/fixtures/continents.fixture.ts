import { BaseFixture } from '@pe/cucumber-sdk';

class CountinentFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('continents').insertOne({
      _id: 'continentCode',
      name: 'name',
    });
  }
}

export = CountinentFixture;
