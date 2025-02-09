import { BaseFixture } from '@pe/cucumber-sdk';
import { getModelToken } from '@nestjs/mongoose';
import { defaultAppsModel, DefaultAppsModel } from '../../src/models/default-apps.model';
import { DefaultApps } from '../../src/models/interfaces/default-apps';
import { Model } from 'mongoose';
import { DASHBOARD_APP_APP1_ID, DASHBOARD_APP_APP2_ID } from './const';

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
            app: DASHBOARD_APP_APP1_ID,
            code: 'business-app1',
            installed: false,
          },
          {
            app: DASHBOARD_APP_APP2_ID,
            code: 'business-app2',
            installed: false,
          },
        ],
      },
      {
        _id: 'user',
        installedApps: [
          {
            app: DASHBOARD_APP_APP1_ID,
            code: 'user-app1',
            installed: false,
          },
        ],
      },
      {
        _id: 'admin',
        installedApps: [
          {
            app: DASHBOARD_APP_APP2_ID,
            code: 'admin-app1',
            installed: false,
          },
        ],
      },
      {
        _id: 'partner',
        installedApps: [
          {
            app: DASHBOARD_APP_APP2_ID,
            code: 'partner-app1',
            installed: true,
          },
        ],
      },
    ] as DefaultApps[]);
  }
};
