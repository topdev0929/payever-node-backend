import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { BusinessModel, DomainModel } from '../models';
import { BusinessEventsEnum } from '../enums/business-events.enum';
import { DomainService, SitesService } from '../services';
import { SitesRepository } from '../repositories';
import { SiteDocument } from '../schemas';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { CompiledThemeModel } from '@pe/builder-theme-kit';
import { SiteMessagesProducer } from '../producers';

@Injectable()
export class BusinessListener {
    constructor(
        private readonly siteService: SitesService,
        private readonly sitesRepository: SitesRepository,
        private readonly compiledThemeService: CompiledThemeService,
        private readonly domainService: DomainService,
        private readonly siteMessagesProducer: SiteMessagesProducer,
    ) { }
    @EventListener(BusinessEventsEnum.BusinessCreated)
    public async onBusinessCreated(business: BusinessModel): Promise<void> {
        await this.createSite(business);
    }

    @EventListener(BusinessEventsEnum.BusinessExport)
    public async onBusinessExport(business: BusinessModel): Promise<void> {
        const sites: SiteDocument[] = await this.sitesRepository.findByBusiness(business);
        if (sites.length === 0) {
            await this.createSite(business);
        } else if (sites.length === 1) {
            // first site should be installed automatically, this is fix to rbmq
            const compiledTheme: CompiledThemeModel = await this.compiledThemeService.findByApplicationId(sites[0]._id);
            if (!compiledTheme) {
                const domain: string = await this.domainService.getDomain(sites[0]);
                await this.siteMessagesProducer.siteExport(sites[0], domain);
            }
        }
    }

    private async createSite(business: BusinessModel): Promise<void> {
        await this.siteService.create(business, {
            name: business.name,
        });
    }
}
