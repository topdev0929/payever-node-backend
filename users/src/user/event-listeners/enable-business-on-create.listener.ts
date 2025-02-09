import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '../enums';
import { BusinessModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { BusinessService } from '../services';

@Injectable()
export class EnableBusinessOnCreateListener {
  constructor(private readonly businessService: BusinessService ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async enableBusiness(business: BusinessModel): Promise<void> {
    await this.businessService.enableBusiness(business);
  }
}
