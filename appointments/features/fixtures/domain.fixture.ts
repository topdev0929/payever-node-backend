import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

import {
  BusinessFactory,
  AccessConfigFactory,
  DomainFactory,
  AppointmentNetworkFactory,
} from '../factories';
import {
  AccessConfigModel,
  AppointmentNetworkModel,
  DomainModel,
} from '../../src/appointment-network/models';
import { BusinessModel } from '@pe/business-kit';
import { AppointmentNetworkSchemaName } from '../../src/appointment-network/schemas';

const APPOINTMENT_NETWORK_ID: string = 'ssssssss-ssss-ssss-ssss-ssssssssssss';
const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
const ACCESS_CONFIG_ID: string = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
const DOMAIN_ID: string = 'dddddddd-dddd-dddd-dddd-dddddddddddd';

class DomainFixture extends BaseFixture {
  private readonly businessModel: Model<BusinessModel> = this.application.get('BusinessModel');
  private readonly accessConfigModel: Model<AccessConfigModel> 
  = this.application.get('AccessConfigModel');
  private readonly domainModel: Model<DomainModel> = this.application.get('DomainModel');
  private readonly appointmentNetworkModel: Model<AppointmentNetworkModel> 
  = this.application.get(getModelToken(AppointmentNetworkSchemaName));

  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      currency: 'EUR',
    }));

    await this.appointmentNetworkModel.create(AppointmentNetworkFactory.create({
      _id: APPOINTMENT_NETWORK_ID,
      business: BUSINESS_ID,
    }));

    await this.accessConfigModel.create(AccessConfigFactory.create({
      _id: ACCESS_CONFIG_ID,
      business: BUSINESS_ID,
      appointmentNetwork: APPOINTMENT_NETWORK_ID,
    }));

    await this.domainModel.create(DomainFactory.create({
      _id: DOMAIN_ID,
      name: 'google.com',

      appointmentNetwork: APPOINTMENT_NETWORK_ID,
    }));
  }
}

export = DomainFixture;
