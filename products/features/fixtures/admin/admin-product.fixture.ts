import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { BusinessModel } from '../../../src/business/models';
import { ProductModel } from '../../../src/products/models';


const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';
const PRODUCT_ID_1: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp1';
const PRODUCT_ID_2: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp2';
const PRODUCT_ID_3: string = 'pppppppp-pppp-pppp-pppp-ppppppppppp3';
const SKU_1: string = 'sku1';
const SKU_2: string = 'sku2';
const SKU_3: string = 'sku3';

class AdminProductFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly productModel: Model<ProductModel> = this.application.get('ProductModel');

  public async apply(): Promise<void> {

    const companyDetail: any = { companyAddress: { }, companyDetails: { }, contactDetails: { } };
    await this.businessModel.create({ ...companyDetail, _id: BUSINESS_ID_1, name: 'Test Company 1' });
    await this.businessModel.create({ ...companyDetail, _id: BUSINESS_ID_2, name: 'Test Company 2' });

    const productTemplate: any = JSON.parse(`{      
      "apps": [],
      "active": true,
      "collections": [],
      "channelSets": [],
      "imagesUrl": [],
      "images": [],
      "dropshipping": false,
      "variants": [],
      "example": false,
      "videosUrl": [],
      "videos": [],
      "isLocked": false,
      "title": "product-title",
      "description": "product-description",
      "price": 1000,
      "sale": {
        "onSales": true,
        "salePrice": 1000
      },
      "barcode": "1000",
      "categories": [],
      "slug": "product-title",
      "options": [],
      "priceTable": [],
      "attributes": [],
      "variantAttributes": [],
      "currency": "EUR",
      "company": "company-a",
      "vatRate": 0,
      "country": "country",
      "language": "language",
      "type": "physical",
      "importedId": null,
      "uuid": "0a01e80c-558a-4339-b80d-b43ba80c47b2",
      "hidden": false,
      "enabled": true
    }`);

    await this.productModel.create({
      ...productTemplate,
      _id: PRODUCT_ID_1,
      businessId: BUSINESS_ID_1,
      businessUuid: BUSINESS_ID_1,      
      sku: SKU_1,      
      slug: 'product-title-1',
    });

    await this.productModel.create({
      ...productTemplate,
      _id: PRODUCT_ID_2,
      businessId: BUSINESS_ID_2,
      businessUuid: BUSINESS_ID_2,      
      sku: SKU_2,      
      slug: 'product-title-2',
    });

    await this.productModel.create({
      ...productTemplate,
      _id: PRODUCT_ID_3,
      businessId: BUSINESS_ID_1,
      businessUuid: BUSINESS_ID_1,
      sku: SKU_3,    
      slug: 'product-title-3',  
    });

  }
}

export = AdminProductFixture;
