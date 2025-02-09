import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessStepModel } from '../../../src/stepper/models';
import { BusinessStepFactory } from '../factories/business-step.factory';
import { SectionsEnum } from '../../../src/stepper/enums';
import { businessModel, BusinessModel } from '../../../src/models/business.model';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ANOTHER_BUSINESS_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

class SetActiveBusinessStepFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<BusinessStepModel> = this.application.get<Model<BusinessStepModel>>(
      getModelToken('BusinessStep'),
    );

    const business: Model<BusinessModel> = this.application.get<Model<BusinessModel>>(
      getModelToken(businessModel.modelName),
    );

    await business.create({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    });

    await model.create(
      BusinessStepFactory.create({
        _id: '11111111-1111-1111-1111-111111111111',
        businessId: BUSINESS_ID,
        isActive: true,
        section: SectionsEnum.Shop,
      }),
    );

    await model.create(
      BusinessStepFactory.create({
        _id: '22222222-2222-2222-2222-222222222222',
        businessId: BUSINESS_ID,
        isActive: false,
        section: SectionsEnum.Shop,
      }),
    );

    await model.create(
      BusinessStepFactory.create({
        _id: '33333333-3333-3333-3333-333333333333',
        businessId: BUSINESS_ID,
        isActive: true,
        section: SectionsEnum.Shipping,
      }),
    );

    await model.create(
      BusinessStepFactory.create({
        _id: '44444444-4444-4444-4444-444444444444',
        businessId: ANOTHER_BUSINESS_ID,
        isActive: true,
        section: SectionsEnum.Shop,
      }),
    );
  }
}

export = SetActiveBusinessStepFixture;
