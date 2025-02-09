import { Injectable, Logger } from '@nestjs/common';
import { BaseCrmClientService } from '../../base-crm/services';
import { BaseCrmContactInterface } from '../../base-crm/interfaces';
import { environment } from '../../environment/environment';

// TODO: Move it to basecrm module once we get rid of mailbox

@Injectable()
export class BaseCrmService {
  constructor(
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly logger: Logger,
  ) { }

  public async createContactAndLead(dto: BaseCrmContactInterface): Promise<BaseCrmContactInterface> {
    let contact: BaseCrmContactInterface = await this.baseCrmClientService.findContactByEmail(dto.email);

    if (!contact) {
      contact = await this.baseCrmClientService.createContact(dto);
      this.logger.log(`Created BaseCRM contact with email ${dto.email}`);
    } else {
      this.logger.log(`BaseCRM contact with email ${dto.email} already exists`);
    }

    if (!await this.baseCrmClientService.findLeadByEmail(dto.email)) {
      await this.baseCrmClientService.createLeadFromContact(contact, environment.baseCrm.formLeadSourceId);
      this.logger.log(`Created BaseCRM lead with email ${dto.email}`);
    }

    return contact;
  }
}
