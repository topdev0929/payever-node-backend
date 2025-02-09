import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { GeckoboardDatasetService } from '../services';
import { EventsEnum } from '../../integration/enum';

@Injectable()
export class TransactionEventListener {
  constructor(
    private readonly geckoboardDatasetService: GeckoboardDatasetService,
  ) {
  }

  @EventListener(EventsEnum.TransactionCreated)
  public async trackTransaction(payment: any): Promise<void> {
    await this.geckoboardDatasetService.trackTransaction(
      payment.total_base_currency,
      payment.address.country,
    );
  }
}
