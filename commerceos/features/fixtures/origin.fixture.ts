import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DASHBOARD_APP_APP1_ID } from './const';
import { OriginAppModel, originAppModel } from '../../src/models/origin-app.model';
import { OriginApp } from '../../src/models/interfaces/origin-app';

export = class OriginFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const apps: Model<OriginAppModel> = this.application.get<Model<OriginAppModel>>(
      getModelToken(originAppModel.modelName),
    );

    await apps.create([
      {
        _id: 'business',
        defaultApps: [
          DASHBOARD_APP_APP1_ID,
        ],
      },
    ] as OriginApp[]);
  }
};
