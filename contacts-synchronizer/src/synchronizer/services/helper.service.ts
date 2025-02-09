import { Injectable } from '@nestjs/common';
import { IntegrationModel, IntegrationService } from '@pe/synchronizer-kit';
import { BusinessModel, BusinessService } from '@pe/business-kit';

@Injectable()
export class HelperService {
  constructor(
    private readonly integrationService: IntegrationService,
    private readonly businessService: BusinessService,
  ) { }

  public async getIntegrationAndBusiness(
    integrationName: string,
    businessId: string,
  ): Promise<[IntegrationModel, BusinessModel]> {
    return Promise.all([
      this.integrationService.findOneByName(integrationName),
      this.businessService.findOneById(businessId),
    ]);
  }
}
