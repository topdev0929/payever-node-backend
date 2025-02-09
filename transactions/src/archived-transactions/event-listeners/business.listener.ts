import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { BusinessMessagesHooksEnum } from '@pe/business-kit';
import { ArchivedTransactionService } from '../services';
import { BusinessDto } from '../../business/dto';

@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly archivedTransactionService: ArchivedTransactionService,
  ) { }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreRemovedHook)
  public async onBusinessRemoved(business: BusinessDto): Promise<void>  {
    await this.archivedTransactionService.archiveTransactionsOnBusinessDelete(business);
  }
}
