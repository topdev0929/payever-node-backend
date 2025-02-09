import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { IntegrationModel, IntegrationSchemaName, IntegrationSubscriptionModel, IntegrationSubscriptionSchemaName } from '../../../src/integration';

const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const INTEGRATION_ID_1: string = '11111111-1111-1111-1111-111111111111';
const INTEGRATION_ID_2: string = '22222222-2222-2222-2222-222222222222';

class AdminIntegrationCreateFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly integrationModel: Model<IntegrationModel> = this.application.get(getModelToken(IntegrationSchemaName));

  public async apply(): Promise<void> {
   
    await this.businessModel.create({
      _id: BUSINESS_ID_1,
      name: 'Test business',
      companyAddress: {
      },
      companyDetails: {
      },
      contactDetails: {
      }
    } as any);

    await this.integrationModel.create(
      {
        _id: INTEGRATION_ID_1,        
        name: "my name -1",
        category: "my  category 1",
        categoryIcon: "my categoryIcon 1",
        displayOptions: {          
          icon: "#icon-message-email",
          title: "email"
        },
        installationOptions: { },
        allowedBusinesses:["B1","B2"]
      });

    await this.integrationModel.create(
      {
        _id: INTEGRATION_ID_2,        
        name: "my name -2",
        category: "my  category 2",
        categoryIcon: "my categoryIcon 2",
        displayOptions: {          
          "icon": "#icon-message-email",
          "title": "email"
        },
        installationOptions: {}
      });
  }
}

export = AdminIntegrationCreateFixture;



