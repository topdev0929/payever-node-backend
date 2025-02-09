import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { ApplicationSchemaName } from '../../src/schemas';
import { ApplicationModel } from "../../src/interfaces";

class ApplicationsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<ApplicationModel> = this.application.get(getModelToken(ApplicationSchemaName));

    await model.create({
      name: 'Default Application',

      businessId: '21e67ee2-d516-42e6-9645-46765eadd0ac',
      channelSetId: '7013667a-2344-4bb5-bc1f-fa10eae21c91',
      checkout: 'bf62b5a8-9687-4f62-acd0-398722a81d9c',
      applicationId: 'c26f4496-c5dd-482c-9380-5d6bc1ecb989',
      type: 'terminal',
    });
  }
}

export = ApplicationsFixture;
