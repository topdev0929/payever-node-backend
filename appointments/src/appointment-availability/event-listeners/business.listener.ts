import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum, BusinessModel } from '@pe/business-kit';
import { AppointmentAvailabilityService } from '../services';
import { AppointmentAvailabilityDocument } from '../schemas';

@Injectable()
export class BusinessListener {
  constructor(
    private readonly availabilityService: AppointmentAvailabilityService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void> {
    await this.createFromEvent(business);
  }

  @EventListener(BusinessEventsEnum.BusinessExport)
  public async onBusinessExported(business: BusinessModel): Promise<void> {
    await this.createFromEvent(business);
  }

  private async createFromEvent(business: BusinessModel): Promise<void> {
    const availabilities: AppointmentAvailabilityDocument[] = await this.availabilityService.find({
      businessId: business._id,
    });
    
    if (availabilities && availabilities.length) {
      return;
    }

    await this.availabilityService.createDefault(business);
  }
}
