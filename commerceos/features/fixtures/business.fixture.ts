// tslint:disable: object-literal-sort-keys
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { businessModel, BusinessModel } from '../../src/models/business.model';
import { SetupStatusEnum } from '../../src/apps/enums/setup-status.dto';
import {
  DASHBOARD_APP_MESSAGE_ID,
  DASHBOARD_APP_MISSING_ID,
  DASHBOARD_APP_APP1_ID,
  DASHBOARD_APP_APP2_ID,
  BUSINESS_1_ID,
  BUSINESS_2_ID,
  BUSINESS_3_ID, BUSINESS_4_ID,
} from './const';

export = class BusinessFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<BusinessModel> = this.application.get<Model<BusinessModel>>(
      getModelToken(businessModel.modelName),
    );

    await model.create([{
      _id: BUSINESS_1_ID,
      installedApps: [
        {
          app: DASHBOARD_APP_APP1_ID,
          code: 'business-app1',
          installed: true,
        },
        {
          app: DASHBOARD_APP_APP2_ID,
          code: 'business-app2',
          installed: true,
        },
      ],
    }, {
      _id: BUSINESS_2_ID,
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
      _id: BUSINESS_3_ID,
      installedApps: [
        {
          installed: false,
          setupStatus: SetupStatusEnum.NotStarted,
          app: DASHBOARD_APP_MISSING_ID,
          code: 'message',
        },
        {
          installed: true,
          setupStatus: SetupStatusEnum.NotStarted,
          app: DASHBOARD_APP_MISSING_ID,
          code: 'message',
        },
        {
          installed: true,
          setupStatus: SetupStatusEnum.Completed,
          app: DASHBOARD_APP_MESSAGE_ID,
          code: 'message',
        },
      ],
    },
    {
      _id: BUSINESS_4_ID,
      registrationOrigin: 'business',
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
    }]);
  }
};
