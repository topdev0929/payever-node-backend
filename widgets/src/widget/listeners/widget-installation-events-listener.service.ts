import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { WidgetInstallationService } from '../services';

@Injectable()
export class WidgetInstallationEventsListener {

  constructor(
    private readonly widgetInstallationService: WidgetInstallationService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await business.populate('installations').execPopulate();
    for (const widgetInstallation of business.installations) {
      await this.widgetInstallationService.remove(widgetInstallation);
    }
  }
}
