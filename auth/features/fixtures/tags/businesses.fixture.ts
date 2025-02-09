import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { PartnerBusinessSchemaName } from '../../../src/partners/schemas';
import { PartnerTagInterface } from '../../../src/partners/interfaces';
import { PartnerTagName } from '@pe/nest-kit';

class BusinessFixture extends BaseFixture {
  private readonly model: Model<PartnerTagInterface>
    = this.application.get(getModelToken(PartnerBusinessSchemaName));

  public async apply(): Promise<void> {
    const businessWithSantanderTag: string = '426fafeb-132f-4ea1-96df-03bd993f126c';
    const businessWithoutTags: string = '06916ce0-c9cc-401a-ac18-22fbce616521';

    await this.model.create({
      _id: businessWithSantanderTag,
      partnerTags: [PartnerTagName.santander],
    },                      {
      _id: businessWithoutTags,
      partnerTags: [],
    });
  }
}

export = BusinessFixture;
