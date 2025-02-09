import { BaseFixture } from '@pe/cucumber-sdk/module';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SynchronizationSchemaName } from '@pe/synchronizer-kit';
import { IntegrationModel, IntegrationSchemaName, SynchronizationModel } from '@pe/synchronizer-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';


const BUSINESS_ID_1: string = 'business-1';
const BUSINESS_ID_2: string = 'business-2';
const BUSINESS_ID_3: string = 'business-3';
const INTEGRATION_ID_1: string = 'integration-1';
const INTEGRATION_ID_2: string = 'integration-2';
const INTEGRATION_ID_3: string = 'integration-3';
const SYNCHRONIZATION_ID_1: string = 'synchronization-1';
const SYNCHRONIZATION_ID_2: string = 'synchronization-2';
const SYNCHRONIZATION_ID_3: string = 'synchronization-3';
const SYNCHRONIZATION_ID_4: string = 'synchronization-4';

class AdminSchedulerFixture extends BaseFixture {
  private readonly synchronizationModel: Model<SynchronizationModel>
    = this.application.get(getModelToken(SynchronizationSchemaName));
  private readonly integrationModel: Model<IntegrationModel>
    = this.application.get(getModelToken(IntegrationSchemaName));
  private readonly businesModel: Model<BusinessModel>
    = this.application.get(getModelToken(BusinessSchemaName));


  public async apply(): Promise<void> {

    await this.businesModel.create({
      _id: BUSINESS_ID_1,
      name: 'test business 1',
    });

    await this.businesModel.create({
      _id: BUSINESS_ID_2,
      name: 'test business 2',
    });

    await this.integrationModel.create({
      _id: INTEGRATION_ID_1,
      category: 'shop',
      name: 'ebay',
    });

    await this.integrationModel.create({
      _id: INTEGRATION_ID_2,
      category: 'shop',
      name: 'shopify',
    });

    await this.integrationModel.create({
      _id: INTEGRATION_ID_3,
      category: 'payment',
      name: 'paypal',
    });

    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_1,
      businessId: BUSINESS_ID_1,
      integration: INTEGRATION_ID_1,
      isInwardEnabled: true,
      customSyncInterval: 1,
    });

    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_2,
      businessId: BUSINESS_ID_1,
      integration: INTEGRATION_ID_2,
      isOutwardEnabled: true,
      customSyncInterval: 2,
    });

    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_3,
      businessId: BUSINESS_ID_2,
      integration: INTEGRATION_ID_3,
      isInventorySyncEnabled: true,
      customSyncInterval: moment.duration(10,'minute').asMilliseconds(),
      lastSynced: moment().subtract(5,'minute'),
    });

    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_4,
      businessId: BUSINESS_ID_3,
      integration: INTEGRATION_ID_3,
      isInventorySyncEnabled: false,
      isInwardEnabled: false,
      isOutwardEnabled: false,      
    });
  }
}

export = AdminSchedulerFixture;
