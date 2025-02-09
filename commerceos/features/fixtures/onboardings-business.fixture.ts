import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseFixture } from '@pe/cucumber-sdk';
import { OnboardingModel } from '../../src/onboarding/models';
import { OnboardingSchemaName } from '../../src/onboarding/schemas';
import { DASHBOARD_APP_APP1_ID, DASHBOARD_APP_APP2_ID } from './const';

export = class OnboardingsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<OnboardingModel> =
      this.application.get(getModelToken(OnboardingSchemaName));

      await model.create({
        "_id": "79087d15-217e-466d-9a69-2beb5d7fcc89",
        "name": "business",
        "logo": "logo.png",
        "type": "partner",
        "wallpaperUrl" : "https://hello.com",
        "afterLogin": [],
        "afterRegistration": [
          {
            "method": "PATCH",
            "name": "install-apps",
            "url": "https://hello.com",
            "payload": {
              "apps": [
                {
                  "app": DASHBOARD_APP_APP1_ID,
                  "code": "checkout",
                  "installed": true,
                  "order": 50
                },
                {
                  "app": DASHBOARD_APP_APP2_ID,
                  "code": "connect",
                  "installed": false
                },
              ]
            },
          },
        ],
      });
  }
};
