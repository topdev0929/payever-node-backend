import { getModelToken } from '@nestjs/mongoose';
import { DashboardAppModel } from '@pe/app-registry-sdk';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

class BusFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<DashboardAppModel> = this.application.get<Model<DashboardAppModel>>(
      getModelToken('DashboardApp'),
    );

    await model.create({
      _id: '33cb2a9f-7942-4cea-88be-de311bf323d4',
      access: {},
      bootstrapScriptUrl: 'http://bootstrapScriptUrl1',
      code: 'shop',
      dashboardInfo: undefined,
      order: 1,
      tag: 'tag1',
    });

    await model.create({
      _id: 'bd5110c7-1a84-40b7-9ef5-9cb6510cb7fd',
      access: {},
      bootstrapScriptUrl: 'http://bootstrapScriptUrl2',
      code: 'pos',
      dashboardInfo: undefined,
      order: 2,
      tag: 'tag2',
    });
  }
}

export = BusFixture;
