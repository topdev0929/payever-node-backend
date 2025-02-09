import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SynchronizationSchemaName } from '@pe/synchronizer-kit';
import { IntegrationModel, IntegrationSchemaName, SynchronizationModel } from '@pe/synchronizer-kit';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import * as moment from 'moment';


const BUSINESS_ID_1: string = 'business-1';
const BUSINESS_ID_2: string = 'business-2';
const INTEGRATION_ID_1: string = 'integration-1';
const INTEGRATION_ID_2: string = 'integration-2';
const INTEGRATION_ID_3: string = 'integration-3';
const SYNCHRONIZATION_ID_1: string = 'synchronization-1';
const SYNCHRONIZATION_ID_2: string = 'synchronization-2';
const SYNCHRONIZATION_ID_3: string = 'synchronization-3';

class CustomeSyncIntervalFixture extends BaseFixture {
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


    // should be synced
    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_1,
      businessId: BUSINESS_ID_1,
      integration: INTEGRATION_ID_1,
      isInwardEnabled: true,
      customSyncInterval: moment.duration(5,'minutes'),
      lastSynced: moment().subtract(10, 'minutes'),
    });


    // should not be synced
    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_2,
      businessId: BUSINESS_ID_1,
      integration: INTEGRATION_ID_2,
      isOutwardEnabled: true,
      customSyncInterval: moment.duration(1,'hours'),
      lastSynced: moment().subtract(50, 'minutes'),
    });

    // should be synced
    await this.synchronizationModel.create({
      _id: SYNCHRONIZATION_ID_3,
      businessId: BUSINESS_ID_2,
      integration: INTEGRATION_ID_3,
      isInventorySyncEnabled: true,
      customSyncInterval: moment.duration(1,'days'),
      lastSynced: moment().subtract(24, 'hours'),
    });
  }
}

export = CustomeSyncIntervalFixture;
