import { Injectable, NotFoundException } from '@nestjs/common';
import { SiteAccessConfigsRepository, SitesRepository } from '../repositories';
import { DomainService } from './domain.service';
import { SitesService } from './sites.service';
import { DomainModel } from '../models';
import { AccessConfigResultDto } from '../dto';
import { SiteAccessConfigDocument, SiteDocument } from '../schemas';
import { accessConfigToResponseDto } from '../transformers';

@Injectable()
export class CommonService {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly sitesService: SitesService,
    private readonly domainService: DomainService,
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
  ) {
  }

  public async getAccessConfigByDomain(domain: string): Promise<AccessConfigResultDto>  {
    const accessConfig: SiteAccessConfigDocument = await this.sitesService.getAccessConfigByInternalOrOwnDomain(domain);
    if (!accessConfig) {
      const siteDomain: DomainModel = await this.domainService.findByDomain(domain);

      if (!siteDomain) {
        throw new NotFoundException('Site for domain is not found');
      }

      const siteAccessConfig: SiteAccessConfigDocument = await this.siteAccessConfigsRepository.findOneByCondition({
        site: siteDomain.site,
      });

      if (!siteAccessConfig.isLive) {
        throw new NotFoundException('Site is not live yet');
      }

      const siteModel: SiteDocument = await this.sitesRepository.findById(siteDomain.site as any);

      await siteModel
        .populate('channelSetDocument')
        .populate('business')
        .execPopulate();

      return {
        id: siteModel._id,
        ...siteModel.toObject(),
        accessConfig: accessConfigToResponseDto(siteAccessConfig),
      };
    }

    if (!accessConfig.isLive) {
      throw new NotFoundException('Site is not live yet');
    }

    await accessConfig
      .populate({
        path: 'site',
      })
      .execPopulate();

    const site: SiteDocument = await this.sitesRepository.findById(accessConfig.site);

    await site
      .populate('channelSetDocument')
      .populate('business')
      .execPopulate();

    return {
      id: site._id,
      ...site.toObject(),
      accessConfig: accessConfigToResponseDto(accessConfig),
    };
  }
}
