/* eslint-disable object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { PaymentMethodMigrationMappingSchemaName } from '../../../src/mongoose-schema';
import { PaymentMethodMigrationMappingModel } from '../../../src/common/models';

class MigrationMappingFixture extends BaseFixture {
  private readonly model: Model<PaymentMethodMigrationMappingModel> =
    this.application.get(getModelToken(PaymentMethodMigrationMappingSchemaName));

  public async apply(): Promise<void> {
    await this.model.create({
      _id: '6bc1c1f9-c399-4ce6-a4e3-6cad101ef0b3',
      businessId: '012c165f-8b88-405f-99e2-82f74339a757',
      paymentMethodFrom: 'santander_invoice_de',
      paymentMethodTo: 'zinia_bnpl_de',
      enabled: true,
    } as any);

    await this.model.create({
      _id: '9c4c6049-62a6-4146-aa5f-8d98bdbf513b',
      businessId: 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f',
      paymentMethodFrom: 'santander_invoice_de',
      paymentMethodTo: 'zinia_bnpl_de',
      enabled: true,
    } as any);

    await this.model.create({
      _id: 'f1c8250f-a1bd-470d-8723-098b86b12697',
      businessId: null,
      paymentMethodFrom: 'santander_installment',
      paymentMethodTo: 'zinia_installment_de',
      enabled: true,
    } as any);
  }
}

export = MigrationMappingFixture;
