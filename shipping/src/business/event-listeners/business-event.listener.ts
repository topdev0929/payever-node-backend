import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum } from '@pe/business-kit';
import { ShippingSettingService } from '../../shipping/services';
import { BusinessModel } from '../models';



@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly shippingSettingService: ShippingSettingService,
  ) { }
  
  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void>  {
    await this.shippingSettingService.createAutoProfile(business);
  }
}
