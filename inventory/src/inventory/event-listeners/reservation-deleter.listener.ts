import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { ReservationService } from '../services';
import { EventListener } from '@pe/nest-kit';

@Injectable()
export class ReservationDeleterListener {
  constructor(
    private readonly reservationService: ReservationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.reservationService.deleteAllByBusinessId(business.id);
  }
}
