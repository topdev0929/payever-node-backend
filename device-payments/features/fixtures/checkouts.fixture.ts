import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { CheckoutModel } from '../../src/interfaces';
import { CheckoutSchemaName } from '../../src/schemas';

class CheckoutsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<CheckoutModel> = this.application.get(getModelToken(CheckoutSchemaName));

    await model.create({
      _id: 'bf62b5a8-9687-4f62-acd0-398722a81d9c',
      keyword: undefined,
      message: '{{application_url}} {{shop_name}}',
      phoneNumber: '79528224321',
    });
  }
}

export = CheckoutsFixture;
