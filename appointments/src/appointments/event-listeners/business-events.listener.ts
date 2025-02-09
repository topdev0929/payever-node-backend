import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { FieldService } from '../services';
import { BusinessModel, BusinessEventsEnum } from '@pe/business-kit';

@Injectable()
export class BusinessEventsListener {
  constructor(
    private readonly fieldService: FieldService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    await this.fieldService.createOrUpdateFromBusiness(business);
  }

  @EventListener(BusinessEventsEnum.BusinessUpdated)
  public async onBusinessUpdated(updated: BusinessModel): Promise<void> {
    await this.fieldService.createOrUpdateFromBusiness(updated);
  }

  @EventListener(BusinessEventsEnum.BusinessRemoved)
  public async onBusinessDeleted(business: BusinessModel): Promise<void> {
    await this.fieldService.deleteForBusiness(business.id);
  }
}
