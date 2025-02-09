// tslint:disable: no-identical-functions
import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { BasicListener } from './basic.listener';
import { ContactDocument } from '../../submodules/platform';
import { EventOriginEnum } from '../../enums';

import {
  ContactsProducerInterface,
  ProducerInterface,
} from '../../producers';
import { InternalEventCodesEnum } from '../../../common';

@Injectable()
export class ContactsListener extends BasicListener {
  @EventListener(InternalEventCodesEnum.ContactCreated)
  public async onContactCreated(
    contact: ContactDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceContactsChangedEvent(
      'contactCreated',
      contact,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.ContactUpdated)
  public async onContactUpdated(
    contact: ContactDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    await this.produceContactsChangedEvent(
      'contactUpdated',
      contact,
      eventSource,
    );
  }

  @EventListener(InternalEventCodesEnum.ContactStatus)
  public async onContactStatus(
    dto: { business: string; contactId: string },
    eventSource: EventOriginEnum,
  ): Promise<void> {
    const contact: ContactDocument = await this.contactsService.findById(dto.contactId);
    await this.produceContactsChangedEvent(
      'contactStatus',
      contact,
      eventSource,
    );
  }

  private async produceContactsChangedEvent(
    method: keyof ContactsProducerInterface,
    contact: ContactDocument,
    eventSource: EventOriginEnum,
  ): Promise<void> {
    return this.invokeProducers(eventSource, (producer: ProducerInterface) => producer[method](contact));
  }
}
