import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { SiteDocument, SiteSchemaName, SiteAccessConfigDocument } from '../schemas';
import { SiteMessagesProducer } from '../producers';
import { DomainService } from '../services/domain.service';
import { DomainModel } from '../models/domain.model';
import { SiteAccessConfigsRepository } from '../repositories/site-access-configs.repository';
import { environment } from '../../environments';

@Injectable()
export class SiteExportCommand {
  constructor(
    @InjectModel(SiteSchemaName) private readonly sitesModel: Model<SiteDocument>,
    private readonly siteRabbitEventsProducer: SiteMessagesProducer,
    private readonly domainService: DomainService,
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
  ) { }

  @Command({
    command: 'site:export [--uuid] [--after]',
    describe: 'Export sites through the bus',
  })
  public async siteExport(
    @Option({
      name: 'uuid',
    }) siteId?: string,
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: any = { };
    if (siteId) {
      criteria._id = siteId;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    const count: number = await this.sitesModel.countDocuments(criteria).exec();
    const limit: number = 100;
    let start: number = 0;
    let sites: SiteDocument[] = [];

    while (start < count) {
      sites = await this.getWithLimit(criteria, start, limit);
      start += limit;

      for (const site of sites) {
        await site.populate('business').execPopulate();
        await site.populate('accessConfigDocument').execPopulate();
        const domain: string = await this.getDomain(site);
        await this.siteRabbitEventsProducer.siteExport(site, domain);
      }
    }
  }

  private async getWithLimit(
    query: { },
    start: number,
    limit: number,
  ): Promise<SiteDocument[]> {
    return this.sitesModel.find(query, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }

  private async getDomain(site: SiteDocument): Promise<string> {
    const foundDomains: DomainModel[] = await this.domainService.findBySite(site);
    if (foundDomains && foundDomains.length > 0) {
      const domain: DomainModel = foundDomains.find(async (dmn: DomainModel) => {
        return dmn.isConnected;
      });
      if (domain) {
        return domain.name;
      }
    }
    const siteAccessConfig: SiteAccessConfigDocument = await this.siteAccessConfigsRepository.findOneByCondition(
      {
        site: site._id,
      },
    );

    if (!siteAccessConfig) {
      return;
    }

    return siteAccessConfig.ownDomain ? siteAccessConfig.ownDomain
    : `${siteAccessConfig.internalDomain}.${environment.sitesDomain}`;
  }
}
