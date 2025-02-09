import { BUSINESS_ID, MAIL_ACCESS_CONFIG_ID, MAIL_ID } from './mail.fixture.base';
import { BusinessFactory, MailAccessConfigFactory, MailFactory } from '../factories';
import { BusinessModel } from '../../../src/modules/business/models';
import { MailAccessConfigModel, MailModel } from '../../../src/modules/mail/models';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BusinessSchemaName,
  MailAccessConfigSchemaName,
  MailSchemaName,
} from '../../../src/modules/mongoose-schema/mongoose-schema.names';
import { BaseFixture } from '@pe/cucumber-sdk';

class MailFixture extends BaseFixture {
  protected readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly mailModel: Model<MailModel> = this.application.get(getModelToken(MailSchemaName));
  protected readonly mailAccessConfigModel: Model<MailAccessConfigModel>
    = this.application.get(getModelToken(MailAccessConfigSchemaName));

  public async apply(): Promise<void> {
    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
      name: 'business test',
    }));
    const mail: MailModel = await this.mailModel.create(MailFactory.create({
      _id: MAIL_ID,
      accessConfig: MAIL_ACCESS_CONFIG_ID,
      businessId: business._id,
      name: 'business test',
    } as any));
    await this.mailAccessConfigModel.create(MailAccessConfigFactory.create({
      _id: MAIL_ACCESS_CONFIG_ID,
      internalDomain: 'business-test',
      internalDomainPattern: 'business-test',
      isLive: false,
      mail: mail._id,
    } as any));
  }
}

export = MailFixture;
