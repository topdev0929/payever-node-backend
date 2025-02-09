import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { IntegrationModel } from '../../../../../../src/integration/models';
import { IntegrationSchemaName } from '../../../../../../src/mongoose-schema';

class IntegrationsFixture extends BaseFixture {
  private readonly model: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '044aace0-866c-4221-b37a-dccf9a8c5cd5',
      category: 'payments',
      name: 'paypal',
    } as any);

    await this.model.create({
      _id: '459891bb-78e3-413e-b874-acbdcaef85d6',
      category: 'payments',
      name: 'santander_installment',
    } as any);
  }
}

export = IntegrationsFixture;
