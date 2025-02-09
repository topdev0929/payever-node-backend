import { Injectable } from '@nestjs/common';
import { BaseCrmContactInterface } from '../base-crm/interfaces';
import { SignupsService } from './signups.service';
import { EventListener } from '@pe/nest-kit';
import { BaseCrmEventsEnum } from '../base-crm';

@Injectable()
export class BaseCrmEventListener {
  constructor(
    private readonly signupsService: SignupsService,
  ) { }

  @EventListener(BaseCrmEventsEnum.ContactCreated)
  public async onContactCreated(contact: BaseCrmContactInterface): Promise<void> {
    await this.signupsService.connectSignupToCrmContactId(contact.email, contact.id);
  }
}
