import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { DefaultStepModel } from '../../../src/stepper/models';
import { DefaultStepFactory } from '../factories';
import { SectionsEnum } from '../../../src/stepper/enums';
import { businessModel, BusinessModel } from '../../../src/models/business.model';

class GetDefaultStepsListFixture extends BaseFixture {
  public async apply(): Promise<void> {
    const model: Model<DefaultStepModel> = this.application.get<Model<DefaultStepModel>>(
      getModelToken('DefaultStep'),
    );

    const business: Model<BusinessModel> = this.application.get<Model<BusinessModel>>(
      getModelToken(businessModel.modelName),
    );

    await business.create({
      _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    });

    await model.create(
      DefaultStepFactory.create({
        _id: '11111111-1111-1111-1111-111111111111',
        action: 'step_1',
        allowSkip: false,
        order: 1,
        section: SectionsEnum.Shop,
        title: 'Step 1',
      }),
    );

    await model.create(
      DefaultStepFactory.create({
        _id: '22222222-2222-2222-2222-222222222222',
        action: 'step_2',
        allowSkip: true,
        order: 2,
        section: SectionsEnum.Shop,
        title: 'Step 2',
      }),
    );
  }
}

export = GetDefaultStepsListFixture;
