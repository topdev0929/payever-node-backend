import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import * as moment from 'moment';
import { MailchimpClientService, MailchimpContactInterface } from '../../mailchimp';
import { BaseCrmClientService, BaseCrmContactInterface } from '../../base-crm';
import { CrmToMailchimpConverter } from '../converter';
import { environment } from '../../environment/environment';

@Injectable()
export class MailchimpContactsCommand {
  constructor(
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly mailchimpClientService: MailchimpClientService,
    private readonly logger: Logger,
  ) {
  }

  @Command({ command: 'contacts:sync:crm-to-mailchimp', describe: 'Import contacts from Base CRM into MailChimp' })
  public async synchronize(): Promise<void> {
    let isFinished: boolean = false;
    let pageNumber: number = 1;
    let errorsCount: number = 0;
    let createdCount: number = 0;
    let lastContact: BaseCrmContactInterface;

    this.logger.log('Starting contacts:sync:crm-to-mailchimp');

    do {
      const crmContactsPacket: [{ data: BaseCrmContactInterface }] =
        await this.baseCrmClientService.getContacts(pageNumber);

      this.logger.log(`Received contacts packet ${pageNumber} of size ${crmContactsPacket.length}`);

      for (const wrappedContact of crmContactsPacket) {
        try {
          if (await this.upsertMailChimpContact(CrmToMailchimpConverter.convert(wrappedContact.data))) {
            createdCount++;
          }
          lastContact = wrappedContact.data;
        } catch (error) {
          errorsCount++;
          this.logger.error(error);
        }
      }

      if (lastContact) {
        // Base CRM have no filter by date, so we calculate it manually
        isFinished = moment(lastContact.created_at).isBefore(environment.syncFromDate);
      }

      isFinished = isFinished || !crmContactsPacket.length;
      pageNumber++;
    } while (!isFinished);

    this.logger.log(`Total contacts created: ${createdCount}`);
    this.logger.log(`Errors count: ${errorsCount}`);
  }

  private async upsertMailChimpContact(contact: MailchimpContactInterface): Promise<boolean> {
    if (!contact.email_address) {
      return false;
    }

    const exists: boolean = await this.mailchimpClientService.doesContactExist(contact.email_address);
    const shouldIgnore: boolean = environment.ignoreEmails.includes(contact.email_address);

    if (!exists && !shouldIgnore) {
      await this.mailchimpClientService.createContact(contact);
      this.logger.log(`MailChimp contact ${contact.email_address} has been created`);

      return true;
    }

    return false;
  }
}
