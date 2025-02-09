import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { BusinessModel } from '../../business/models';
import { WidgetTutorialService } from '../services';

@Injectable()
export class WidgetTutorialEventsListener {

  constructor(
    private readonly widgetTutorialService: WidgetTutorialService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  private async handleBusinessRemoved(business: BusinessModel): Promise<void> {
    await business.populate('tutorials').execPopulate();
    for (const widgetTutorial of business.tutorials) {
      await this.widgetTutorialService.remove(widgetTutorial);
    }
  }
}
