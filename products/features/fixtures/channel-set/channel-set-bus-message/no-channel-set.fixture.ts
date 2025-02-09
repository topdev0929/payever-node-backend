import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../../src/business';
import { BusinessSchemaName } from '../../../../src/business/schemas';
import { businessFactory } from '../../factories';

class NoChannelSetFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';

    await this.businessModel.create(businessFactory({
      _id: businessId,
    }));
  }
}

export = NoChannelSetFixture;
