import { BaseFixture } from '@pe/cucumber-sdk/module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel, BusinessSchemaName } from '@pe/business-kit';
import { AccessConfigModel, AppointmentNetworkModel } from '../../src/appointment-network/models';
import { AccessConfigFactory, AppointmentNetworkFactory } from '../factories';
import { AppointmentNetworkSchemaName } from '../../src/appointment-network/schemas';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const AFFILIATE_BRANDING_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaac';

class AppointmentNetworkFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly appointmentNetworkModel: Model<AppointmentNetworkModel> 
    = this.application.get(getModelToken(AppointmentNetworkSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create({
      _id: BUSINESS_ID,
      name: 'Test business',
    } as any);

    await this.appointmentNetworkModel.create(AppointmentNetworkFactory.create({
      _id: AFFILIATE_BRANDING_ID,
      business: BUSINESS_ID,
      name: 'Test Branding',
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      internalDomain: 'evgen8',
      isLive: true,
      ownDomain: 'google.com',
      appointmentNetwork: AFFILIATE_BRANDING_ID,
    }));
  }
}

export = AppointmentNetworkFixture;



