import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as dns from 'dns';
import { CheckDomainStatusResultInterface } from '../interfaces';
import { DomainModel } from '../models';
import { DomainRepository } from '../repositories/domain.repository';
import { SiteDocument, DomainSchemaName, SiteAccessConfigDocument, SiteSchemaName } from '../schemas';
import { SiteAccessConfigsRepository } from '../repositories/site-access-configs.repository';
import { environment } from '../../environments';
import { SiteMessagesProducer } from '../producers/site-messages.producer';
import { CreateDomainDto, DomainQueryDto } from '../dto';
import { Populated } from '../../common';

// TODO: move to .env file
const PAYEVER_IP: string = '52.136.251.236';
const HOUR_IN_MS: number = 60000; // 60 * 1000

@Injectable()
export class DomainService {
  constructor(
    @InjectModel(DomainSchemaName) private readonly domainModel: Model<DomainModel>,
    private readonly domainRepository: DomainRepository,
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
    private readonly siteRabbitEventsProducer: SiteMessagesProducer,
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteDocument>,
  ) { }

  public async getForAdmin(query: DomainQueryDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: query.businessIds };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    if (query.siteId) {
      conditions.site = query.siteId;
    }

    const documents: DomainModel[] = await this.domainModel
      .find(conditions)
      .select(query.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit)
      .exec();

    const total: number = await this.domainModel.count().exec();

    return {
      documents,
      page,      
      total,
    };
  }

  public async findBySite(site: SiteDocument): Promise<DomainModel[]> {
    return this.domainModel.find({
      site: site._id,
    });
  }

  public async getDomain(site: SiteDocument): Promise<string> {
    const foundDomains: DomainModel[] = await this.findBySite(site);
    if (foundDomains && foundDomains.length > 0) {
      const domain: DomainModel =
          foundDomains.find(async (dmn: DomainModel) => {
            return dmn.isConnected;
          });
      if (domain) {
        return domain.name;
      }
    }

    const siteAccessConfig: Populated<SiteAccessConfigDocument, `siteDocument`> =
        await this.siteAccessConfigsRepository.findOneByCondition(
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

  public async checkStatus(domain: DomainModel): Promise<CheckDomainStatusResultInterface> {
    const [
      cnames,
      lookupADdress,
    ]: [string[], dns.LookupAddress] = await Promise.all([
      dns.promises.resolveCname(domain.name).catch(() => []),
      dns.promises.lookup(domain.name),
    ]);
    const isConnected: boolean = lookupADdress.address === PAYEVER_IP;

    await this.domainRepository.update({ _id: domain._id, isConnected: isConnected });

    const accessConfig: SiteAccessConfigDocument = await this.siteAccessConfigsRepository.findOneByCondition({
      site: domain.site,
    });

    const ownDomain = isConnected ? domain.name : undefined;
    await this.siteAccessConfigsRepository.updateById(accessConfig.id, { ownDomain });

    const statusChanged = isConnected !== domain.isConnected;
    if (statusChanged) {
      const newDomain = isConnected
        ? domain.name
        : `${accessConfig.internalDomain}.${environment.sitesDomain}`;

      await this.siteRabbitEventsProducer.siteDomainChanged(domain.site, newDomain);
    }

    return {
      cnames,
      isConnected,
      requiredIp: PAYEVER_IP,
      ownDomain,
    };
  }

  public async findByDomain(domain: string): Promise<DomainModel> {
    return this.domainModel.findOne({
      name: domain,
    });
  }

  public async findByCondition(condition: any): Promise<DomainModel[]> {
    return this.domainModel.find(condition);
  }

  public async getDomainForLastHour(): Promise<DomainModel[]> {
    const hourAgo: Date = new Date(Date.now() - HOUR_IN_MS);

    return this.findByCondition({
      createdAt: {
        $gte: hourAgo,
      },
    });
  }

  public async createDomain(siteId: string, dto: CreateDomainDto): Promise<DomainModel> {

    const existingDomainWithSameName: DomainModel[] = await this.domainRepository.read({
      name: dto.name,
    });

    if (existingDomainWithSameName.length) {
      throw new ConflictException({
        message: `Domain with name '${dto.name}' already used.`,
      });
    }

    const site: SiteDocument = await this.siteModel.findById(siteId);

    if (!site) {
      throw new NotFoundException(`site with id: ${siteId} does not exist`);
    }

    const siteAccessConfigs: Populated<SiteAccessConfigDocument, 'siteDocument'> = await this.siteAccessConfigsRepository.findOneByCondition({site:site._id});

    if(!siteAccessConfigs){
      throw new NotFoundException(`site config with site id: ${siteId} does not exist`);
    }

    await this.siteAccessConfigsRepository.createOne(site, { isLive: false, ownDomain: dto.name });

    const newDomain: DomainModel = await this.domainRepository.create({
      isConnected: false,
      name: dto.name,
      provider: dto.provider,
      site: site._id,
    });

    await site.updateOne({
      $push: {
        domain: newDomain._id,
      },
    }).exec();

    return newDomain;
  }

  public async deleteDomain(domainId: string): Promise<void> {
    const domain: DomainModel = await this.domainModel.findById(domainId);
    if (!domain) {
      throw new NotFoundException(`domain with id: ${domainId} does not exist`);
    }

    const site: SiteDocument = await this.siteModel.findById(domain.site);
    if (!site) {
      throw new NotFoundException(`site with id: ${domain.site} does not exist`);
    }

    const accessConfig: SiteAccessConfigDocument = 
      await this.siteAccessConfigsRepository.findOneByDomainName(domain.name, site._id);

    await domain.deleteOne();
    await this.siteAccessConfigsRepository.deleteByDomainName(domain.name, site._id);
    await site.updateOne({
      $pull: {
        domain: domainId as any,
        accessConfig: accessConfig._id,
      },
    }).exec();
  }
}
