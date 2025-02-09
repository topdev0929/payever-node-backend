import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { AffiliatesMessagesProducer } from '../producers';
import { BusinessAffiliatesEventEnum } from '../enums';
import { BusinessAffiliateModel } from '../models';

@Injectable()
export class BusinessAffiliatesListener {
  constructor(
    private readonly affiliatesMessagesProducer: AffiliatesMessagesProducer,
  ) { }

  @EventListener(BusinessAffiliatesEventEnum.BusinessAffiliateCreated)
  public async onBusinessAffiliateCreated(businessAffiliate: BusinessAffiliateModel): Promise<void>  {
    await this.affiliatesMessagesProducer.sendBusinessAffiliateCreatedMessage(businessAffiliate);
  }


  @EventListener(BusinessAffiliatesEventEnum.BusinessAffiliateRemoved)
  public async onBusinessAffiliateRemoved(businessAffiliate: BusinessAffiliateModel): Promise<void>  {
    await this.affiliatesMessagesProducer.sendBusinessAffiliateDeletedMessage(businessAffiliate);
  }
}
