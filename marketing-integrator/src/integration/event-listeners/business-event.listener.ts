import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel, BusinessEventsEnum } from '@pe/business-kit';
import { BusinessSynchronizerService } from '../services';


@Injectable()
export class BusinessEventListener {
  constructor(
    private readonly businessSyncrhonizerService: BusinessSynchronizerService,
  ) { }
  
  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async onBusinessCreated(business: BusinessModel): Promise<void>  {
    await this.businessSyncrhonizerService.syncBusinessUserAccountWithCrmContact(business._id, true);

  }

  @EventListener(BusinessEventsEnum.BusinessUpdated)
  public async onBusinessUpdated(business: BusinessModel): Promise<void>  {
    await this.businessSyncrhonizerService.syncBusinessUserAccountWithCrmContact(business._id);
  }
}
