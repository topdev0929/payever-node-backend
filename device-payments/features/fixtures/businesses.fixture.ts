import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { VerificationType } from '../../src/enum';
import { BusinessModel } from '../../src/interfaces';
import { BusinessSchemaName } from '../../src/schemas';

class BusinessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

    await model.create({
      _id: '21e67ee2-d516-42e6-9645-46765eadd0ac',
      businessId: '21e67ee2-d516-42e6-9645-46765eadd0ac',
      defaultApplications: [
        {
          _id: 'c26f4496-c5dd-482c-9380-5d6bc1ecb989',
          type: 'terminal'
        },
      ],
      settings: {
        autoresponderEnabled: true,
        enabled: true,
        secondFactor: false,
        verificationType: VerificationType.verifyByPayment,
      },

    });
  }
}

export = BusinessesFixture;
