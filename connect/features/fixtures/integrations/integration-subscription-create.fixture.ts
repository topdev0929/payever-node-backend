import * as uuid from 'uuid';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { IntegrationSubscriptionModel, IntegrationSubscriptionSchemaName } from '../../../src/integration';


const BUSINESS_ID_1: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const BUSINESS_ID_2: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbc';
const INTEGRATION_SUBSCRIPTIOIN_ID_1: string = '11111111-1111-1111-1111-111111111111';
const INTEGRATION_SUBSCRIPTIOIN_ID_2: string = '22222222-2222-2222-2222-222222222222';

class AdminIntegrationSubscriptionCreateFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly integrationSubscriptionModel: Model<IntegrationSubscriptionModel> = this.application.get(getModelToken(IntegrationSubscriptionSchemaName));

  public async apply(): Promise<void> {
    
    const businessDetails = {
      companyAddress: {       
      },
      companyDetails: {        
      },
      contactDetails: {        
      }
    }
    await this.businessModel.create({
      _id: BUSINESS_ID_1,
      name: 'Test business',
      ...businessDetails,
    } as any);
    
    await this.businessModel.create({
      _id: BUSINESS_ID_2,
      name: 'Test business 2',
      ...businessDetails,
    } as any);


    await this.integrationSubscriptionModel.create(
      {
        _id: INTEGRATION_SUBSCRIPTIOIN_ID_1,
        businessId: BUSINESS_ID_1,
        integration: '4d5ea0fb-2991-4495-9d38-d58f1961c8ef',
        installed: true,
      });

    await this.integrationSubscriptionModel.create(
      {
        _id: INTEGRATION_SUBSCRIPTIOIN_ID_2,
        businessId: BUSINESS_ID_2,
        integration: '4d5ea0fb-2991-4495-9d38-d58f1961c8ef',
        installed: false,
      });
  }
}

export = AdminIntegrationSubscriptionCreateFixture;


