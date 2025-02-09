import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { defaultAppsModel, DefaultAppsModel } from '../../src/models/default-apps.model';
import { DefaultApps } from '../../src/models/interfaces/default-apps';
import { Model } from 'mongoose';

export = class DefaultFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const apps: Model<DefaultAppsModel> = this.application.get<Model<DefaultAppsModel>>(
      getModelToken(defaultAppsModel.modelName),
    );

    await apps.create([
      {
        _id: 'business',
        installedApps: [
          {
            app: '37370e19-1ab0-4a22-83ed-2f2a090f485d',
            code: 'business-app1',
            installed: false,
          },
          {
            app: '44f60143-2aee-40fb-87ad-074dd133e048',
            code: 'business-app2',
            installed: false,
          },
        ],
      },
    ] as DefaultApps[]);
  }
};
