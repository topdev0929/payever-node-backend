/* eslint-disable-object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { FraudListFactory } from '../fixture-factories';
import { FraudListSchemaName } from '../../src/fraud/schemas';
import { FraudListModel } from '../../src/fraud/models';
import { ListTypeEnum } from '../../src/fraud/enums';

class TestFixture extends BaseFixture {
  private FraudListModel: Model<FraudListModel> = this.application.get(getModelToken(FraudListSchemaName));

  public async apply(): Promise<void> {
    const fraudListId: string = '71d15d86-7d1d-4178-b0c8-1d4e1230b2c0';
    const fraudListId2: string = 'a016f1c7-c27a-4343-a7d8-be6002c98b6c';
    const businessId: string = '02c50fb6-3fbe-4941-81bc-f3ecceed9ced';

    const fraudList: FraudListModel = await this.FraudListModel.create(FraudListFactory.create({
      _id: fraudListId,
      businessId: businessId,
      name: 'Trusted Emails',
      type: ListTypeEnum.email,
      description: 'Trusted Emails description',
      values: [
        'trusted1@email.com',
        'trusted2@email.com',
        'trusted3@email.com',
      ]
    }) as any);

    await fraudList.save();

    const fraudList2: FraudListModel = await this.FraudListModel.create(FraudListFactory.create({
      _id: fraudListId2,
      businessId: businessId,
      name: 'Blocked Emails',
      type: ListTypeEnum.email,
      description: 'Trusted Emails description',
      values: [
        'blocked1@email.com',
        'blocked2@email.com',
        'blocked3@email.com'
      ]
    }) as any);

    await fraudList2.save();
  }
}

export = TestFixture;
