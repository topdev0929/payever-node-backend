import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel } from '../../business/models';
import { FinanceExpressManager } from '../services';
import { ConnectionEvent } from '../../connection';

@Injectable()
export class InvalidateInitCacheListener {
  constructor(
    private financeExpressManager: FinanceExpressManager,
  ) { }

  @EventListener(ConnectionEvent.ConnectionCreated)
  public async connectionCreated(
    business: BusinessModel,
  ): Promise<void> {
    await this.financeExpressManager.invalidateCacheByBusiness(business);
  }
}
