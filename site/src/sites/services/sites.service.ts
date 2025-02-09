import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CHANNEL_SET_SERVICE,
  ChannelEventMessagesProducer,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  ChannelSetServiceInterface,
} from '@pe/channels-sdk';

import type { Populated } from '../../common';
import { EntityExistsException, LastSiteRemovingException } from '../../common/exceptions';
import { environment } from '../../environments';
import { AdminCreateSiteDto, CreateSiteDto, LinksMaskingIngressDto, UpdateSiteDto } from '../dto';
import { BusinessModel } from '../models';
import { SiteMessagesProducer } from '../producers';
import { SiteAccessConfigsRepository, SitesRepository } from '../repositories';
import { SiteAccessConfigDocument, SiteDocument } from '../schemas';
import { EventDispatcher, RedisClient } from '@pe/nest-kit';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';
import { BusinessSchemaName, BusinessService } from '@pe/business-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { DomainHelper } from '../helpers';


@Injectable()
export class SitesService {
  constructor(
    private readonly channelService: ChannelService,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetsService: ChannelSetServiceInterface,
    private readonly channelEventsProducer: ChannelEventMessagesProducer,
    private readonly sitesMessagesProducer: SiteMessagesProducer,
    private readonly sitesRepository: SitesRepository,
    private readonly siteAccessConfigsRepository: SiteAccessConfigsRepository,
    private readonly dispatcher: EventDispatcher,
    private readonly compiledThemeService: CompiledThemeService,
    private readonly businessService: BusinessService,
    private readonly redisClient: RedisClient,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,

  ) { }


  public async createForAdmin(createSiteDto: AdminCreateSiteDto): Promise<SiteDocument> {
    const business: any = await this.businessModel.findById(createSiteDto.businessId);

    return this.create(business, createSiteDto);
  }

  public async create(business: BusinessModel, createSiteDto: CreateSiteDto): Promise<SiteDocument> {
    await this.validateSiteName(createSiteDto.name, business, null);

    const channel: ChannelModel = await this.channelService.findOneByType('site');
    await business
    .populate({
      path: 'channelSets',
      populate: {
        path: 'channel',
      },
    })
    .execPopulate();

    const channelSets: ChannelSetModel[] = await this.channelSetsService.create(channel, business);
    const channelSet: ChannelSetModel = channelSets[0];

    this.channelEventsProducer.sendChannelSetNamedByApplication(
      channelSet,
      createSiteDto.name,
    ).catch();

    const activeSite: SiteDocument = await this.sitesRepository.getDefault(business);

    const site: SiteDocument = activeSite
      ? await this.sitesRepository.clone(business, activeSite, channelSet, createSiteDto)
      : await this.sitesRepository.create(business, channelSet, createSiteDto);

    const accessConfig: SiteAccessConfigDocument =
      await this.siteAccessConfigsRepository.createOne(site, { isLive: false });
    site.accessConfig.push(accessConfig._id);
    await site.save();
    const createdSite: SiteDocument = await this.sitesRepository.findById(site._id);
    await createdSite
      .populate('business')
      .populate({
        path: 'channelSetDocument',
        populate: {
          path: 'channel',
        },
      })
      .execPopulate();

    this.sitesMessagesProducer.siteCreated(
      createdSite,
      `${createdSite.accessConfigDocument?.[0]?.internalDomain}.${environment.sitesDomain}`,
    ).catch();

    this.sitesMessagesProducer.appCreated(
      createdSite,
    ).catch();

    await createdSite
    .populate({
      path: 'channelSet',
      populate: {
        path: 'channel',
      },
    })
    .execPopulate();

    return createdSite;
  }

  public async update(site: SiteDocument, business: BusinessModel, dto: UpdateSiteDto): Promise<SiteDocument> {
    await this.validateSiteName(dto.name, business, site.id);
    const newSite: SiteDocument = await this.sitesRepository.update(site, dto);
    await newSite.populate('accessConfigDocument').execPopulate();
    this.sitesMessagesProducer.siteUpdated(newSite).catch();

    return newSite;
  }

  public async makeDefault(site: SiteDocument, business: BusinessModel): Promise<SiteDocument> {
    await this.sitesRepository.resetDefault(business);

    const updatedSite: SiteDocument = await this.sitesRepository.update(site, { isDefault: true });
    await updatedSite.populate('accessConfigDocument').execPopulate();

    this.sitesMessagesProducer.siteIsDefaultUpdated(updatedSite).catch();

    return updatedSite;
  }

  public async delete(site: SiteDocument): Promise<void> {
    const currentSitesCount: number = await this.sitesRepository.countForBusiness(site.business);

    if (currentSitesCount === 1) {
      throw new LastSiteRemovingException(`Can not delete the last site`);
    }

    await site.populate('accessConfigDocument').execPopulate();

    await this.sitesRepository.delete(site);
    this.sitesMessagesProducer.siteRemoved(site).catch();
    this.sitesMessagesProducer.appRemoved(site).catch();
  }

  public async getByInternalOrOwnDomain(
    domain: string,
  ): Promise<Populated<SiteDocument, 'accessConfigDocument' | 'domainDocument'>> {
    const accessConfig: SiteAccessConfigDocument = await this.getAccessConfigByInternalOrOwnDomain(domain);

    return accessConfig && this.sitesRepository.findById(accessConfig.site);
  }

  public async getAccessConfigByInternalOrOwnDomain(domain: string): Promise<SiteAccessConfigDocument> {
    const sitesDomain: string = (environment.sitesDomain || '').replace('DOMAIN.', '');
    const oldDomain: string = sitesDomain.replace('new.', '');

    const condition = {$or:[
      { internalDomain: domain.replace('.' + sitesDomain, '') },
      { internalDomain: domain.replace('.' + oldDomain, '') },
      { ownDomain: DomainHelper.nameToDomain(domain) },
    ]};

    return this.siteAccessConfigsRepository.findOneByCondition(condition);
  }

  /** @TODO: Validate site name with class-validator constraint */
  public async validateSiteName(name: string, business: BusinessModel, siteId: string): Promise<void> {
    if (await this.sitesRepository.isNameOccupied(name, business, siteId)) {
      throw new EntityExistsException(
        `Site with name "${name}" already exists for business: "${business.id}"`,
      );
    }
  }

  public async validateSiteNameWithReturn(name: string, business: BusinessModel, siteId: string): Promise<any> {
    try {
      await this.validateSiteName(name, business, siteId);

      return { result: true };
    } catch (e) {
      return {
        message: (e && e.message) ? e.message : '',
        result: false,
      };
    }
  }

  public async linksMaskingIngress(dto: LinksMaskingIngressDto): Promise<void> {
    const payload: any[] = [];
    const accessConfig: SiteAccessConfigDocument = await this.siteAccessConfigsRepository.findOneByCondition(
      { site: dto.pageLinks[0].applicationId },
    );

    /* eslint @typescript-eslint/dot-notation:0 */
    const domainName: string = process.env[`BUILDER_SITE_DOMAINS`]
      .replace('DOMAIN', accessConfig?.internalDomain);

    for (const pageLink of dto.pageLinks) {
      payload.push(
        {
          accessConfigId: accessConfig._id,
          domainName: domainName,
          maskingPath: pageLink.maskingPath,
          targetApp: pageLink.targetApp,
          targetDomain: pageLink.targetDomain,
        },
      );
    }

    await this.dispatcher.dispatch(
      KubernetesEventEnum.LinkMask,
      payload,
    );
  }

  public async getSiteThemeByDomain(domain: string): Promise<any>  {
    const accessConfig = await this.getAccessConfigByInternalOrOwnDomain(domain);

    const site: any = await this.sitesRepository.findById(accessConfig.site);
    const result: any = await this.compiledThemeService.getShopThemeByApplicationId(accessConfig.site);

    if (!await this.businessService.findOneById(site.businessId)) {
      throw new NotFoundException(`domain business not found`);
    }

    return {
      ...result,
      businessId: site.businessId,
    };
  }

  public async refreshThemeCache(
      applicationId: string,
      rebuild: boolean = false,
  ): Promise<void> {
    const accessConfig: Populated<SiteAccessConfigDocument, 'siteDocument'>
        = await this.siteAccessConfigsRepository.findOneByCondition(
        { site: applicationId },
    );

    if (!accessConfig) {
      return ;
    }

    const domainName: string = process.env.BUILDER_SITE_DOMAINS.replace('DOMAIN', accessConfig?.internalDomain);
    const redisKey: string = `site:theme:by-domain:${domainName}`;

    this.redisClient.getClient().del(redisKey).catch().then(async () => {
      if (rebuild) {
        await this.getSiteThemeByDomain(domainName);
      }
    });
  }
}
