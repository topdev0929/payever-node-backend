import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import {
  BaseCrmClientService,
  BaseCrmContactCustomerStatus,
  BaseCrmContactInterface,
  BaseCrmContactProspectStatus,
} from '../../base-crm';

@Injectable()
export class UpdateContactsStatusCommand {
  constructor(
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly logger: Logger,
  ) {
  }

  @Command({ command: 'contacts:update:status', describe: 'Update Base CRM contacts customer_status field' })
  public async update(): Promise<void> {
    let isFinished: boolean = false;
    let pageNumber: number = 1;
    let errorsCount: number = 0;
    let updatedCount: number = 0;

    this.logger.log('Starting contacts:update:status');

    do {
      const crmContactsPacket: [{ data: BaseCrmContactInterface }] =
        await this.baseCrmClientService.getContacts(pageNumber);

      this.logger.log(`Received contacts packet ${pageNumber} of size ${crmContactsPacket.length}`);

      for (const wrappedContact of crmContactsPacket) {
        try {
          await this.updateContact(wrappedContact.data);
          updatedCount++;
        } catch (error) {
          errorsCount++;
          this.logger.error(error);
        }
      }

      isFinished = !crmContactsPacket.length;
      pageNumber++;
    } while (!isFinished);

    this.logger.log(`Total contacts updated: ${updatedCount}`);
    this.logger.log(`Errors count: ${errorsCount}`);
  }

  private async updateContact(contact: BaseCrmContactInterface): Promise<void> {
    await this.baseCrmClientService.updateContact(contact.id, {
      customer_status: BaseCrmContactCustomerStatus.None,
      prospect_status: BaseCrmContactProspectStatus.None,
    });
  }
}
