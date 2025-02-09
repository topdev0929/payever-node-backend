import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { IntegrationModel } from '../../../src/integration';
import { IntegrationSchemaName } from '../../../src/mongoose-schema';

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
    
    await this.model.create({
      _id: 'ac20b0eb-0583-4f8a-81d4-b55598a04cbf',
      category: 'payments',
      name: 'santander_pos_installment',
    } as any);
    
    await this.model.create({
      _id: '43ef6b23-177f-4f8d-a99f-8893cf34f3fd',
      category: 'payments',
      name: 'santander_invoice_de',
    } as any);
    
    await this.model.create({
      _id: '690276a5-053e-4f9c-b40d-a95cffc81056',
      category: 'payments',
      name: 'santander_pos_invoice_de',
    } as any);

    await this.model.create({
      _id: 'edebb298-fd41-4d29-9b9e-633bac416bb8',
      category: 'payments',
      name: 'zinia_bnpl_de',
    } as any);

    await this.model.create({
      _id: '2415ad0c-87b3-44db-9ce4-fb052f48fea1',
      category: 'payments',
      name: 'zinia_installment_de',
    } as any);
    
    await this.model.create({
      _id: '246472f7-554f-4822-a5ce-ece1fe6edcf1',
      category: 'payments',
      name: 'zinia_pos_de',
    } as any);
    
  }
}

export = IntegrationsFixture;
