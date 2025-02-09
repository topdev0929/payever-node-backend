import { Injectable, NotFoundException } from '@nestjs/common';
import { AppWithAccessConfigDto } from '../dto';
import { AccessConfigModel, DomainModel, AffiliateBrandingModel } from '../models';
import { AccessConfigService } from './access-config.service';
import { AffiliateBrandingsService } from './branding.service';
import { DomainService } from './domain.service';

@Injectable()
export class CommonService {
  constructor(
    private readonly domainService: DomainService,
    private readonly accessConfigService: AccessConfigService,
    private readonly affiliateBrandingService: AffiliateBrandingsService,
  ) {
  }

  public async getAccessConfigByDomain(domain: string): Promise<AppWithAccessConfigDto>  {
    let accessConfig: AccessConfigModel = await this.accessConfigService.getByDomain(domain);
    if (!accessConfig) {
      const affiliateDomain: DomainModel = await this.domainService.findByDomain(domain);

      if (!affiliateDomain) {
        throw new NotFoundException('Affiliate Branding for domain is not found');
      }

      accessConfig = await this.accessConfigService.findOneByCondition( 
        { affiliateBranding: affiliateDomain.affiliateBranding },
      );
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Affiliate Branding is not live yet');
    }

    const affiliateBranding: AffiliateBrandingModel = await this.affiliateBrandingService
    .getById(accessConfig.affiliateBranding as string);
    await affiliateBranding.populate('business channelSet').execPopulate();

    const business: any = (accessConfig.affiliateBranding as AffiliateBrandingModel).business as any;

    if (business) {
      business.defaultLanguage = business.defaultLanguage || 'en';
    }

    return {
      ...affiliateBranding.toObject(),
      accessConfig: accessConfig?.toObject(),
    };
  }
}
