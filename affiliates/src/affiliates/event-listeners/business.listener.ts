import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsEnum, BusinessModel } from '@pe/business-kit';
import { AffiliateBrandingsService, AffiliateProgramsService } from '../services';
import { AffiliateBrandingModel } from '../models';

@Injectable()
export class BusinessListener {
  constructor(
    private readonly affiliateBrandingsService: AffiliateBrandingsService,
    private readonly affiliateProgramsService: AffiliateProgramsService,
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
    const brandings: AffiliateBrandingModel[] = await this.affiliateBrandingsService.getByBusiness(business);
    if (brandings && brandings.length) {
      return;
    }

    const defaultBranding: AffiliateBrandingModel = await this.affiliateBrandingsService.create(
      business, { name: business.name, isDefault: true } as any,
    );

    await this.affiliateProgramsService.createDefault(business, defaultBranding._id);
  }
}
