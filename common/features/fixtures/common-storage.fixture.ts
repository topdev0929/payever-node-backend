import { BaseFixture } from '@pe/cucumber-sdk';

class CommonStorageFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('common-storage').insertOne({
      _id: 'SOME_NAME',
      type: 'some type',
      value: 'some value',
    });
  }
}

export = CommonStorageFixture;
