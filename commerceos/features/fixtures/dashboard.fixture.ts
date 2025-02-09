// tslint:disable: object-literal-sort-keys
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { DashboardApp } from '../../src/models/interfaces/dashboard-app';
import { dashboardAppModel, DashboardAppModel } from '../../src/models/dashboard-app.model';
import {
  DASHBOARD_APP_APP1_ID,
  DASHBOARD_APP_APP2_ID,
  DASHBOARD_APP_MESSAGE_ID,
} from './const';

export = class DashboardFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<DashboardAppModel> = this.application.get<Model<DashboardAppModel>>(
      getModelToken(dashboardAppModel.modelName),
    );

    await model.create([
      {
        _id: DASHBOARD_APP_APP1_ID,
        access: {
          business: {
            defaultInstalled: false,
            isDefault: false,
            url: 'http://business-url1',
          },
          user: {
            defaultInstalled: false,
            isDefault: false,
            url: 'http://user-url1',
          },
        },
        allowedAcls: { create: true, delete: false },
        bootstrapScriptUrl: 'http://bootstrapScriptUrl1',
        code: 'transactions',
        order: 1,
        tag: 'tag1',
        dashboardInfo: {
          icon: '#icon-commerceos-message',
          'title': 'dashboard.apps.message',
        },
      },
      {
        _id: DASHBOARD_APP_APP2_ID,
        access: {
          business: {
            defaultInstalled: false,
            isDefault: false,
            url: 'http://business-url2',
          },
          user: {
            defaultInstalled: false,
            isDefault: false,
            url: 'http://user-url2',
          },
        },
        allowedAcls: { create: true, delete: false },
        bootstrapScriptUrl: 'http://bootstrapScriptUrl2',
        code: 'settings',
        dashboardInfo: undefined,
        order: 2,
        tag: 'tag2',
      },
      {
        _id: DASHBOARD_APP_MESSAGE_ID,
        dashboardInfo: {
          icon: '#icon-commerceos-message',
          'title': 'dashboard.apps.message',
        },
        code: 'message',
        tag: '<app-message></app-message>',
        access: {
          admin: {
            defaultInstalled: false,
            isDefault: false,
          },
          business: {
            defaultInstalled: true,
            isDefault: true,
            url: '/business/{uuid}/message',
          },
          partner: {
            defaultInstalled: false,
            isDefault: false,
          },
          user: {
            defaultInstalled: false,
            isDefault: false,
          },
        },
        order: 4,
        bootstrapScriptUrl: '',
        allowedAcls: {
          create: true,
          delete: true,
          read: true,
          update: true,
        },
      },
    ]);
  }
};
