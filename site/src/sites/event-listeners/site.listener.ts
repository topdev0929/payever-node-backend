import { Injectable } from '@nestjs/common';
import { EventListener, RedisClient } from '@pe/nest-kit';

import { SiteDocument } from '../schemas';
import { SiteEventsEnum } from '../enums';
import { SiteElasticService } from '../services';
import { SitesRepository } from '../repositories';
import { CompiledThemeModel } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';

@Injectable()
export class SiteListener {
  constructor(
    private readonly siteElasticService: SiteElasticService,
    private readonly sitesRepository: SitesRepository,
    private readonly redisClient: RedisClient,
    private readonly compiledThemeService: CompiledThemeService,
  ) { }

  @EventListener(SiteEventsEnum.SiteCreated)
  public async onSiteCreated(site: SiteDocument): Promise<void> {
    const fromDatabase: SiteDocument = await this.sitesRepository.findById(site._id);
    this.siteElasticService.saveIndex(fromDatabase).catch();
    this.redisClient.del(`builder|business|${site.business._id}|application|site|list`).catch();
  }

  @EventListener(SiteEventsEnum.SiteUpdated)
  public async onSiteUpdated(_originalSite: SiteDocument, updatedSite: SiteDocument): Promise<void> {
    const fromDatabase: SiteDocument = await this.sitesRepository.findById(updatedSite._id);
    this.siteElasticService.saveIndex(fromDatabase).catch();
    this.redisClient.del(`builder|business|${updatedSite.business._id}|application|site|list`).catch();
  }

  @EventListener(SiteEventsEnum.SiteRemoved)
  public async onSiteRemoved(site: SiteDocument): Promise<void> {
    const compiledTheme: CompiledThemeModel = await this.compiledThemeService.findByApplicationId(site._id);
    await this.compiledThemeService.removeByApplicationId(site._id);

    this.siteElasticService.deleteIndex(site).catch();
    this.redisClient.del(`builder|business|${site.business._id}|application|site|list`).catch();
  }
}
