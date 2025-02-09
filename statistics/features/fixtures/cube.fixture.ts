import { BaseFixture } from '@pe/cucumber-sdk';

const cubeId: string = '568192aa-36ea-48d8-bc0a-8660029e6f72';

class CubeFixture extends BaseFixture {
  public async apply(): Promise<void> {

    await this.connection.collection('cubes').insertOne({
      _id: cubeId,
      code: 'transactions',
      enabled: true,
      name: 'Transactions',
    });
  }
}

export = CubeFixture;
