import { BaseFixture } from '@pe/cucumber-sdk';
import { SampleProductsModel } from '../../../../src/sample-products/models';
import { Model } from 'mongoose';
import { sampleProductFactory } from '../../factories';

class BusinessCreateSampleProductFixture extends BaseFixture {
  private readonly sampleProductsModel: Model<SampleProductsModel> = this.application.get('SampleProductsModel');

  public async apply(): Promise<void> {
    await this.sampleProductsModel.create(sampleProductFactory({ vatRate: null}));
    await this.sampleProductsModel.create(sampleProductFactory({ vatRate: null}));
    await this.sampleProductsModel.create(sampleProductFactory({ vatRate: null}));

    await this.sampleProductsModel.create(
      sampleProductFactory({
        industry: 'BRANCHE_SPORTS',
        product: 'BUSINESS_PRODUCT_RETAIL_B2C',
        vatRate: null,
      }),
    );
    await this.sampleProductsModel.create(
      sampleProductFactory({
        industry: 'BRANCHE_SPORTS',
        product: 'BUSINESS_PRODUCT_RETAIL_B2C',
        vatRate: null,
      }),
    );
    await this.sampleProductsModel.create(
      sampleProductFactory({
        industry: 'BRANCHE_SPORTS',
        product: 'BUSINESS_PRODUCT_RETAIL_B2C',
        vatRate: null,
      }),
    );
  }
}

export = BusinessCreateSampleProductFixture;
