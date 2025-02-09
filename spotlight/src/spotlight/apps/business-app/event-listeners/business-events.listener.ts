import { BusinessMessagesHooksEnum, BusinessDto, RemoveBusinessDto } from '@pe/business-kit';
import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { OwnerInterface, SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { AppEnum } from '../../../enums';


@Injectable()
export class BusinessEventsListener {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreCreatedHook)
  public async onBusinessCreated(business: BusinessDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(business);
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreUpdatedHook)
  public async onBusinessUpdated(business: BusinessDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(business);
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreRemovedHook)
  public async onBusinessRemoved(business: RemoveBusinessDto): Promise<void> {
    await this.spotlightService.delete(business._id);
  }

  @EventListener(BusinessMessagesHooksEnum.BusinessPreExportHook)
  public async onBusinessExported(business: BusinessDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(business);
  }

  private async createOrUpdateSpotlightFromEvent(business: BusinessDto): Promise<void> {
    await this.spotlightService.createOrUpdate(
      await this.businessToSpotlightDocument(business), 
      business._id,
    );
  } 

  private async businessToSpotlightDocument(business: BusinessDto): Promise<SpotlightInterface> {

    const owner: OwnerInterface = await this.spotlightService.getOwner(business.owner);

    return {
      app: AppEnum.Businesses,
      description: business.companyAddress?.city,
      icon: business.logo,
      contact: business.contactEmails,
      owner: owner,
      ownerId: business.owner,
      serviceEntityId: business._id,
      title: business.name,
    };
  }
}
