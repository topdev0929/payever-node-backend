/* tslint:disable:no-identical-functions */
import { Injectable } from '@nestjs/common';
import { RabbitMqClient } from '@pe/nest-kit';
import { SiteDocument } from '../schemas';
import { ApplicationThemeDto, CompiledThemeWithPagesInterface } from '@pe/builder-theme-kit';
import { CompiledThemeService } from '@pe/builder-theme-kit/module/service';
import { DomainRabbitmqEventsEnum } from '../enums/domain-rabbitmq-events.enum';
import { AccessConfigResultDto } from '../dto';
import { RabbitMessagesEnum } from '../../common/enums';

@Injectable()
export class SiteMessagesProducer {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly compiledThemeService: CompiledThemeService,
  ) { }

  public async publishSiteData(
    wsKey: string,
    applicationTheme: ApplicationThemeDto,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventThemePublished,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventThemePublished,
        payload: {
          applicationTheme: applicationTheme,
          wsKey: wsKey,
        },
      },
    );
  }

  public async siteCreated(
    site: SiteDocument,
    domain: string,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteCreated,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteCreated,
        payload: {
          appType: 'site',
          type: 'site',
          business: {
            id: site.businessId,
          },
          default: site.isDefault,
          domain,
          id: site.id,
          name: site.name,
          url: site.accessConfigDocument?.length > 0 ? site.accessConfigDocument[0]?.internalDomain : null,
        },
      },
    );
  }

  public async siteUpdated(
    site: SiteDocument,
    domain: string = null,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteUpdated,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteUpdated,
        payload: {
          appType: 'site',
          type: 'site',
          business: {
            id: site.businessId,
          },
          default: site.isDefault,
          domain,
          id: site.id,
          name: site.name,
          url: site.accessConfigDocument?.length > 0 ? site.accessConfigDocument[0]?.internalDomain : null,
        },
      },
    );
  }

  public async appCreated(
    site: SiteDocument,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.EventApplicationCreated,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.EventApplicationCreated,
        payload: {
          business: site.businessId,
          id: site.id,
          type: 'site',
        },
      },
    );
  }

  public async siteExport(
    site: SiteDocument,
    domain: string,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteExport,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteExport,
        payload: {
          appType: 'site',
          type: 'site',
          business: {
            id: site.businessId,
          },
          default: site.isDefault,
          domain,
          id: site.id,
          name: site.name,
        },
      },
    );
  }

  public async siteRemoved(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteRemoved,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteRemoved,
        payload: {
          appType: 'site',
          type: 'site',
          business: {
            id: site.businessId,
          },
          id: site.id,
          url: site.accessConfigDocument?.length > 0 ? site.accessConfigDocument[0]?.internalDomain : null,
        },
      },
    );
  }

  public async appRemoved(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.EventApplicationRemoved,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.EventApplicationRemoved,
        payload: {
          id: site.id,
        },
      },
    );
  }

  public async siteLiveToggled(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteLiveToggled,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteLiveToggled,
        payload: {
          businessId: site.business._id,
          live: site.accessConfigDocument?.[0]?.isLive,
          siteId: site.id,
        },
      },
    );
  }

  public async siteIsDefaultUpdated(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventSiteActiveUpdated,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventSiteActiveUpdated,
        payload: {
          businessId: site.businessId,
          channelSetId: site.channelSetDocument?.[0]?.id || site.channelSet,
          siteId: site._id,
        },
      },
    );
  }

  public async sitePasswordUpdated(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventPasswordUpdated,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventPasswordUpdated,
        payload: {
          businessId: site.businessId,
          password: site.accessConfigDocument?.[0]?.privatePassword,
          siteId: site.id,
        },
      },
    );
  }

  public async sitePasswordToggled(site: SiteDocument): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.SiteEventPasswordToggled,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.SiteEventPasswordToggled,
        payload: {
          businessId: site.businessId,
          password: site.accessConfigDocument?.[0]?.privatePassword,
          siteId: site.id,
        },
      },
    );
  }

  public async siteDomainChanged(
    id: string,
    newDomain: string,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: DomainRabbitmqEventsEnum.DomainUpdated,
        exchange: 'async_events',
      },
      {
        name: DomainRabbitmqEventsEnum.DomainUpdated,
        payload: {
          id,
          newDomain,
        },
      },
    );
  }

  public async elasticSingleIndex(
    data: any,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.ElasticSingleIndex,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.ElasticSingleIndex,
        payload: {
          data,
        },
      },
    );
  }

  public async elasticDeleteByQuery(
    query: any,
  ): Promise<void> {
    await this.rabbitClient.send(
      {
        channel: RabbitMessagesEnum.ElasticDeleteByQuery,
        exchange: 'async_events',
      },
      {
        name: RabbitMessagesEnum.ElasticDeleteByQuery,
        payload: {
          query,
        },
      },
    );
  }
}
