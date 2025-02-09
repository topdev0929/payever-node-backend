import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import { AbstractStateFixture } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/interfaces';
import { BusinessSchemaName } from '../../../src/schemas';
import { VerificationType } from '../../../src/enum';

export class OnboardedBusinessStateFixture extends AbstractStateFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  public getStateName(): string {
    return 'Onboarded business e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf created';
  }
  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: 'e3507c44-0c8a-4f0c-a3ed-d5ef6ff0c9cf',
      businessId: null,
      settings: {
        autoresponderEnabled: true,
        enabled: true,
        secondFactor: false,
        verificationType: VerificationType.verifyByPayment,
      },
    });
  }
}
