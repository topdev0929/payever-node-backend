import { Injectable, Logger } from '@nestjs/common';
import { BaseCrmContactInterface } from '../../base-crm/interfaces';
import { BaseCrmClientService } from '../../base-crm/services';
import { BusinessDetailsResolverService } from './business-details-resolver.service';
import { BaseCrmCustomFieldsEnum } from '../../base-crm/enum';
import { environment } from '../../environment/environment';

@Injectable()
export class BusinessSynchronizerService {
  constructor(
    private readonly baseCrmClientService: BaseCrmClientService,
    private readonly businessDetailsResolverService: BusinessDetailsResolverService,
    private readonly logger: Logger,
  ) { }

  public async registerTransactionInCrmContact(
    businessId: string,
    amount: number,
  ): Promise<BaseCrmContactInterface> {
    const contact: BaseCrmContactInterface =
      await this.syncBusinessUserAccountWithCrmContact(businessId);
    const numberFields: BaseCrmCustomFieldsEnum[] = [
      BaseCrmCustomFieldsEnum.TransactionAmount,
      BaseCrmCustomFieldsEnum.TransactionVolume,
    ];

    for (const customField of numberFields) {
      if (!contact.custom_fields.hasOwnProperty(customField)) {
        contact.custom_fields = {
          ...contact.custom_fields,
          [`${customField}`]: 0,
        };
      }
      contact.custom_fields = {
        ...contact.custom_fields,
        [`${customField}`]: Number(contact.custom_fields[`${customField}`]),
      };
    }

    contact.custom_fields[BaseCrmCustomFieldsEnum.TransactionVolume] += 1;
    contact.custom_fields[BaseCrmCustomFieldsEnum.TransactionAmount] += amount;

    return this.baseCrmClientService.updateContact(contact.id, {
      custom_fields: contact.custom_fields,
    });
  }

  public async syncBusinessUserAccountWithCrmContact(
    businessId: string,
    createLead: boolean = false,
  ): Promise<BaseCrmContactInterface> {
    let contactDto: BaseCrmContactInterface;

    try {
      contactDto = await this.businessDetailsResolverService.resolve(
        businessId,
      );
    } catch (e) {
      throw new Error(`Unable to retrieve business user details: ${e.message}`);
    }
    const contact: BaseCrmContactInterface =
      await this.baseCrmClientService.createOrUpdateContact(contactDto);

    if (!contact) {
      throw new Error(
        `Contact with email ${contactDto.email} not found in CRM for business ${businessId}`,
      );
    }

    if (
      createLead &&
      !(await this.baseCrmClientService.findLeadByEmail(contactDto.email))
    ) {
      await this.baseCrmClientService.createLeadFromContact(
        contact,
        environment.baseCrm.formLeadSourceId,
      );
      this.logger.log(`Created BaseCRM lead with email ${contactDto.email}`);
    }

    this.logger.log({
      contact,
      contactDto,
      context: 'BusinessSynchronizerService',
      message: 'Updated BaseCRM business user contact',
    });

    return contact;
  }
}
