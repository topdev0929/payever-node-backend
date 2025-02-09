import { Injectable } from '@nestjs/common';
import { EventDispatcher } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import slugify from 'slugify';
import { SiteEventsEnum } from '../enums';
import { SiteAccessConfigDocument, SiteAccessConfigSchemaName, SiteDocument, SiteSchemaName } from '../schemas';
import { UpdateAccessConfigDto } from '../dto';
import { SiteMessagesProducer } from '../producers/site-messages.producer';
import { environment } from '../../environments';
import type { Populated } from '../../common';
import { DomainHelper } from '../helpers';
import { KubernetesEventEnum } from '@pe/kubernetes-kit/module/kubernetes/enums';
import { SiteAccessModel } from '../models';

@Injectable()
export class SiteAccessConfigsRepository {
  constructor(
    @InjectModel(SiteSchemaName) private readonly siteModel: Model<SiteDocument>,
    @InjectModel(SiteAccessConfigSchemaName) private readonly siteAccessConfigModel: Model<SiteAccessModel>,
    private readonly siteRabbitEventsProducer: SiteMessagesProducer,
    private readonly dispatcher: EventDispatcher,
  ) {
   }

  public async createOne(
    site: SiteDocument,
    dto: Partial<SiteAccessConfigDocument>,
  ): Promise<SiteAccessConfigDocument> {
    
    const originalSite: SiteDocument = await this.siteModel.findOne({ _id: site._id }).populate('business')
      .populate('accessConfigDocument').exec();

    const accessConfig: SiteAccessConfigDocument = await this.create(site, dto);

    await this.siteModel.updateOne({ _id: site._id }, {$push: {accessConfig: accessConfig._id} }).exec();
    const updatedSite: SiteDocument = await this.siteModel.findById(site._id)
      .populate('accessConfigDocument')
      .populate('domainDocument')
      .populate('business');

    await this.dispatcher.dispatch(SiteEventsEnum.SiteUpdated, originalSite, updatedSite);

    return accessConfig;
  }

  public async updateOne(
    site: SiteDocument,
    dto: Partial<SiteAccessConfigDocument>,
  ): Promise<SiteAccessConfigDocument> {
    
    const originalSite: SiteDocument = await this.siteModel.findOne({ _id: site._id }).populate('business')
      .populate('accessConfigDocument').exec();

    const currentAccessConfigs: SiteAccessConfigDocument[] =
      await this.siteAccessConfigModel.find({ site: site._id }).exec();

    const accessConfig: SiteAccessConfigDocument[] = await Promise.all(
      currentAccessConfigs.map((currentAccessConfig: SiteAccessConfigDocument)=> this.update(currentAccessConfig, dto))
    );

    const updatedSite: SiteDocument = await this.siteModel.findById(site._id)
      .populate('accessConfigDocument')
      .populate('domainDocument')
      .populate('business');

    await this.dispatcher.dispatch(SiteEventsEnum.SiteUpdated, originalSite, updatedSite);

    return accessConfig[0];
  }

  public async setLive(site: SiteDocument): Promise<void> {
    await this.siteAccessConfigModel.findOneAndUpdate(
      { site: site._id },
      {
        $set: {
          isLive: true,
        },
      },
    ).exec();
  }

  public async findOneByCondition(
    condition: FilterQuery<SiteAccessConfigDocument>,
  ): Promise<Populated<SiteAccessConfigDocument, 'siteDocument'>> {
    return (await this.siteAccessConfigModel.findOne(
      condition,
    ).populate('siteDocument')) as Populated<SiteAccessConfigDocument, 'siteDocument'>;
  }

  public async updateById(
    accessConfigId: string,
    dto: UpdateAccessConfigDto,
  ): Promise<SiteAccessConfigDocument> {
    return this.siteAccessConfigModel.findByIdAndUpdate(
      accessConfigId,
      { $set: dto },
      { new: true },
    );
  }

  public async deleteByDomainName(ownDomain: string, siteId: string): Promise<void>{
    return this.siteAccessConfigModel.remove({ownDomain:DomainHelper.nameToDomain(ownDomain), site: siteId });
  }

  public async findOneByDomainName(ownDomain: string, siteId: string): Promise<SiteAccessConfigDocument>{
    return this.siteAccessConfigModel.findOne({ownDomain:DomainHelper.nameToDomain(ownDomain), site: siteId });
  }
  
  private async create(site: SiteDocument, dto: Partial<SiteAccessConfigDocument>): Promise<SiteAccessConfigDocument> {
    dto.site = site.id;
    if (!dto.internalDomain) {
      dto = await this.generateInternalDomain(dto, site.name);
    }

    if (await this.isDomainOccupied(dto.internalDomain, site._id)) {
      const suffix: string
        = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      dto.internalDomain = dto.internalDomain + '-' + suffix;
      dto.internalDomainPattern = dto.internalDomainPattern + '-' + suffix;
    }

    const accessConfig: SiteAccessConfigDocument = await this.siteAccessConfigModel.create({
      internalDomain: DomainHelper.nameToDomain(dto.internalDomain),
      internalDomainPattern: dto.internalDomainPattern ? DomainHelper.nameToDomain(dto.internalDomainPattern) : null,
      isLive: dto.isLive ? dto.isLive : false,
      isLocked: dto.isLocked ? dto.isLocked : false,
      isPrivate: dto.isPrivate ? dto.isPrivate : false,
      ownDomain: dto.ownDomain ? DomainHelper.nameToDomain(dto.ownDomain) : null,
      privateMessage: dto.privateMessage ? dto.privateMessage : null,
      privatePassword: dto.privatePassword ? dto.privatePassword : null,
      socialImage: dto.socialImage || null,

      site: dto.site,
    });
    await this.dispatcher.dispatch(KubernetesEventEnum.AppAccessCreated, accessConfig);

    return accessConfig;
  }

  private async update(
    currentAccessConfig: SiteAccessConfigDocument,
    dto: Partial<SiteAccessConfigDocument>,
  ): Promise<SiteAccessConfigDocument> {
    const oldConfig: SiteAccessConfigDocument =
      await this.siteAccessConfigModel.findById(currentAccessConfig.id).exec();

    if (dto.internalDomain && await this.isDomainOccupied(dto.internalDomain, currentAccessConfig.site)) {
      const suffix: string
        = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
      dto.internalDomain = dto.internalDomain + '-' + suffix;
      dto.internalDomainPattern = dto.internalDomainPattern + '-' + suffix;
    }

    Object.assign(currentAccessConfig, dto);

    await this.siteAccessConfigModel.updateOne(
      {
        _id: currentAccessConfig._id,
      },
      {
        $set: {
          internalDomain: DomainHelper.nameToDomain(currentAccessConfig.internalDomain),
          internalDomainPattern: currentAccessConfig.internalDomainPattern ?
            DomainHelper.nameToDomain(currentAccessConfig.internalDomainPattern) : null,
          isLive: currentAccessConfig.isLive ? currentAccessConfig.isLive : false,
          isLocked: currentAccessConfig.isLocked ? currentAccessConfig.isLocked : false,
          isPrivate: currentAccessConfig.isPrivate ? currentAccessConfig.isPrivate : false,
          ownDomain: currentAccessConfig.ownDomain ? DomainHelper.nameToDomain(currentAccessConfig.ownDomain) : null,
          privateMessage: currentAccessConfig.privateMessage ? currentAccessConfig.privateMessage : null,
          privatePassword: currentAccessConfig.privatePassword ? currentAccessConfig.privatePassword : null,
          socialImage: currentAccessConfig.socialImage || null,

          site: currentAccessConfig.site,
        },
      },
    ).exec();
    const updatedAccessConfig: SiteAccessConfigDocument = await this.siteAccessConfigModel.findOne({
      _id: currentAccessConfig._id,
    }).exec();

    if (dto.internalDomain) {
      await this.siteRabbitEventsProducer.siteDomainChanged(
        currentAccessConfig.site,
        `${currentAccessConfig.internalDomain}.${environment.sitesDomain}`,
      );
    }
    await this.dispatcher.dispatch(KubernetesEventEnum.AppAccessUpdated, oldConfig, updatedAccessConfig);

    return updatedAccessConfig;
  }

  private async generateInternalDomain(
    dto: Partial<SiteAccessConfigDocument>,
    siteName: string,
  ): Promise<Partial<SiteAccessConfigDocument>> {
    const domain: string = slugify(siteName).toLowerCase();
    dto.internalDomainPattern = DomainHelper.nameToDomain(domain);
    dto.internalDomain = await this.isInternalDomainDuplicated(domain)
      ? DomainHelper.nameToDomain(await this.generateSuffixedDomain(domain))
      : DomainHelper.nameToDomain(domain);

    return dto;
  }

  private async isInternalDomainOccupied(domain: string): Promise<boolean> {
    const config: SiteAccessConfigDocument = await this.siteAccessConfigModel.findOne({
      internalDomain: DomainHelper.nameToDomain(domain),
    }).exec();

    return !!config;
  }

  private async isInternalDomainDuplicated(domain: string): Promise<boolean> {
    const config: SiteAccessConfigDocument = await this.siteAccessConfigModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    }).exec();

    return !!config;
  }

  private async generateSuffixedDomain(domain: string): Promise<string> {
    const suffix: string = ('0000' + ((new Date()).getTime() % Math.pow(36, 4)).toString(36)).substr(-4);
    const generated: string = domain + '-' + suffix;
    if (await this.isInternalDomainOccupied(generated)) {
      return this.generateSuffixedDomain(domain);
    }

    return generated;
  }

  private async isDomainOccupied(domain: string, currentSiteId: string): Promise<boolean> {
    const config: SiteAccessConfigDocument = await this.siteAccessConfigModel.findOne({
      internalDomainPattern: DomainHelper.nameToDomain(domain),
    }).exec();

    return !!config && config.site !== currentSiteId;
  }

  
}
