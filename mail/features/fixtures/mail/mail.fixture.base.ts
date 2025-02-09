import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { BusinessFactory, ChannelFactory, MailAccessConfigFactory, MailFactory } from '../factories';
import { BusinessModel } from '../../../src/modules/business/models';
import { MailAccessConfigModel, MailModel } from '../../../src/modules/mail/models';
import {
  BusinessSchemaName,
  MailAccessConfigSchemaName,
  MailSchemaName,
} from '../../../src/modules/mongoose-schema/mongoose-schema.names';
import { ChannelModel, ChannelSchemaName } from '@pe/channels-sdk';

export const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
export const MAIL_ACCESS_CONFIG_ID: string = '22222222-2222-2222-2222-222222222222';
export const MAIL_ID: string = '11111111-1111-1111-1111-111111111111';

export abstract class MailFixtureBase extends BaseFixture {
  protected readonly channelModel: Model<ChannelModel> = this.application.get(getModelToken(ChannelSchemaName));
  protected readonly businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  protected readonly mailModel: Model<MailModel> = this.application.get(getModelToken(MailSchemaName));
  protected readonly mailAccessConfigModel: Model<MailAccessConfigModel>
    = this.application.get(getModelToken(MailAccessConfigSchemaName));

  public async apply(): Promise<void> {
    await this.channelModel.create(ChannelFactory.create({ }));
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
      isLive: true,
      mail: mail._id,
    } as any));
  }
}
