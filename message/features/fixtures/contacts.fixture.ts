import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { ContactDocument } from '../../src/message/submodules/platform';
import { ID_OF_CONTACT, ID_OF_EXISTING_BUSINESS } from './const';
import { MessagingIntegrationsEnum } from '@pe/message-kit';

class ContactsFixture extends BaseFixture {
  protected readonly contactModel: Model<ContactDocument> = this.application.get(`ContactModel`);
  public async apply(): Promise<void> {
    await this.contactModel.create({
      _id: ID_OF_CONTACT,
      business: ID_OF_EXISTING_BUSINESS,
      communications: [{
        identifier: 'any-value',
        integrationName: MessagingIntegrationsEnum.LiveChat,
      }, {
        identifier: 'john@example.com',
        integrationName: MessagingIntegrationsEnum.Email,
      }],
      name: 'John Doe',
    });
  }
}

export = ContactsFixture;
