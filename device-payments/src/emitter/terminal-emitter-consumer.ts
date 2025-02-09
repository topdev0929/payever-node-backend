import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../interfaces';
import { ApplicationService } from '../services/application.service';

@Injectable()
export class TerminalEmitterConsumer {
  constructor(
    private readonly applicationService: ApplicationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.applicationService.deleteAllByBusiness(business);
  }
}
