import { Injectable } from '@nestjs/common';
import { BusinessDto, BusinessEventsEnum, BusinessMessagesHooksEnum } from '@pe/business-kit';
import { BusinessInterface } from '../interfaces';
import { BankAccountService } from '../services';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class BankAccountListener {

  constructor(
    private readonly bankAccountService: BankAccountService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async handleBusinessRemoved(business: BusinessInterface): Promise<void> {
    await this.bankAccountService.deleteAllByBusinessId(business._id);
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreUpdatedHook)
  public async handleBusinessUpdate(business: BusinessDto): Promise<void> {
    this.bankAccountService.upsertBankAccount(business);
  }
}
