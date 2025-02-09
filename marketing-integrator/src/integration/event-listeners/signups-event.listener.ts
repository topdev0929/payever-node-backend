import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { SignupModel, SignupsEventsEnum } from '../../signups';
import { BaseCrmService } from '../services';
import { SignupToCrmConverter } from '../converter/signup-to-crm.converter';

// TODO: Move it to basecrm module once we get rid of mailbox

@Injectable()
export class SignupsEventListener {
  constructor(
    private readonly baseCrmService: BaseCrmService,
  ) { }

  @EventListener(SignupsEventsEnum.SignupCreated)
  public async onSignupRecordCreated(signup: SignupModel): Promise<void> {
    await this.baseCrmService.createContactAndLead(
      SignupToCrmConverter.convert(signup),
    );
  }
}
