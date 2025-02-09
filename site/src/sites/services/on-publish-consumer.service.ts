import { Injectable } from '@nestjs/common';
import { SiteMessagesProducer } from '../producers';
import { SiteAccessConfigsRepository, SitesRepository } from '../repositories';
import { DomainModel } from '../models';
import { DomainService } from './domain.service';
import { CommonService } from './common.service';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { environment } from '../../environments';
import { AccessConfigResultDto, PublishSiteDataPayloadDto } from '../dto';
import { SiteDocument, SiteAccessConfigDocument } from '../schemas';

@Injectable()

export class OnPublishConsumerService {
  constructor(
    private readonly sitesRepository: SitesRepository,
    private readonly domainService: DomainService,
    private readonly commonService: CommonService,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly siteMessagesProducer: SiteMessagesProducer,
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
  ) {
  }

  public async  publishSiteData(
    siteId: string,
    version: string,
  ): Promise<PublishSiteDataPayloadDto> {
    const site: SiteDocument = await this.sitesRepository.findById(siteId);
    await this.siteAccessConfigsRepository.setLive(site);

    const domains: DomainModel[] = await this.domainService.findBySite(site);
    const domainNames: string[] = [];
    let accessConfig: AccessConfigResultDto;

    if (domains.length > 0 || domains[0]) {
      accessConfig = await this.commonService.getAccessConfigByDomain(domains[0].name);
      for (const domain of domains) {
        domainNames.push(domain.name);
      }
    } else {
      const siteAccessConfig: SiteAccessConfigDocument = await this.siteAccessConfigsRepository.findOneByCondition(
        {
          site: siteId,
        },
      );

      const accessDomain: string = siteAccessConfig.ownDomain ? siteAccessConfig.ownDomain
        : `${siteAccessConfig.internalDomain}.${environment.sitesDomain}`;

      domainNames.push(accessDomain);

      accessConfig = await this.commonService.getAccessConfigByDomain(accessDomain);
    }

    if (accessConfig) {
      await this.siteAccessConfigsRepository.updateById(accessConfig.accessConfig._id,
        {
          version: version,
        },
      );
      accessConfig.accessConfig.version = version;
    }

    return {
      accessConfig: [accessConfig],
      domainNames,
    };
  }
}
