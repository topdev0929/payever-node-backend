import { Injectable } from '@nestjs/common';
import { Command, Positional } from '@pe/nest-kit';
import { SiteDocument } from '../schemas';
import { SitesRepository } from '../repositories';

@Injectable()
export class DeleteInactiveSiteCommand {
  constructor(
    private readonly sitesRepository: SitesRepository,
  ) { }

  @Command({
    command: 'delete:inactive:site',
    describe: 'delete inactive site',
  })
  public async deleteInactiveSite(
    @Positional({
      name: 'businessId',
    }) businessId: string,
    @Positional({
      name: 'siteId',
    }) siteId: string,
  ): Promise<void> {
    if (businessId) {
      const sites: SiteDocument[] = await this.sitesRepository.findInactiveByBusinessId(businessId);
      for (const site of sites) {
        await this.deleteSite(site);
      }
    } else if (siteId) {
      const site: SiteDocument = await this.sitesRepository.findById(siteId);
      await site.populate('business').execPopulate();
      await this.deleteSite(site);
    } else {
      while (true) {
        const sites: SiteDocument[] = await this.sitesRepository.findInactive();
        if (sites.length === 0) {
          break;
        }

        for (const site of sites) {
          await this.deleteSite(site);
        }
      }
    }
  }

  private async deleteSite(site: SiteDocument): Promise<void> {
    await this.sitesRepository.delete(site, true);
  }
}
