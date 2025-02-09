import { Injectable } from '@nestjs/common';
import { BusinessModel } from '../../models/business.model';
import { EventListener } from '@pe/nest-kit';
import { BusinessEvents } from '../../business/enums';
import { BusinessStepService, DefaultStepService } from '../services';
import { SectionsEnum } from '../enums';
import { DefaultStepModel } from '../models';

@Injectable()
export class BusinessEventsListener {
  constructor(
    private readonly defaultStepService: DefaultStepService,
    private readonly businessStepService: BusinessStepService,
  ) { }

  @EventListener(BusinessEvents.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    for (const section of [SectionsEnum.Shop]) {
      const defaultSteps: DefaultStepModel[] = await this.defaultStepService.getListForSection(section);
      await this.businessStepService.createStepsForBusiness(business, section, defaultSteps);
    }
  }

  @EventListener(BusinessEvents.BusinessRemoved)
  public async onBusinessRemoved(business: BusinessModel): Promise<void> {
    await this.businessStepService.deleteStepsForBusiness(business);
  }
}
