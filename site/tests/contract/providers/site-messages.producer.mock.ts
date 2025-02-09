import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';

import { DomainRabbitmqEventsEnum } from '../../../src/sites/enums';
import { RabbitMessagesEnum } from '../../../src/common';
import { SiteMessagesProducer } from '../../../src/sites/producers';
import { ApplicationThemeDto } from '@pe/builder-theme-kit';
import { SiteDocument } from '../../../src/sites/schemas';

@Injectable()
export class SiteMessageMock extends AbstractMessageMock {
  private readonly site: SiteDocument = {
    _id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    name: 'name',
    picture: 'picture',
    isDefault: true,
    businessId: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    business: {
      id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    },
    accessConfig: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    channelSet: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
  } as any;

  private readonly appTheme: ApplicationThemeDto =  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    application: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    theme: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  };

  private readonly domain = 'domain.com';

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventThemePublished)
  public async mockSiteEventThemePublished (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.publishSiteData(`aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`, this.appTheme);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteCreated)
  public async mockSiteEventSiteCreated (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteCreated(this.site, this.domain);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteUpdated)
  public async mockSiteEventSiteUpdated (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteUpdated(this.site, this.domain);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteExport)
  public async mockSiteEventSiteExport (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteExport(this.site, this.domain);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteRemoved)
  public async mockSiteEventSiteRemoved (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteRemoved(this.site);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteLiveToggled)
  public async mockSiteEventSiteLiveToggled (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteLiveToggled(this.site);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventSiteActiveUpdated)
  public async mockSiteEventSiteActiveUpdated (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteIsDefaultUpdated(this.site);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventPasswordUpdated)
  public async mockSiteEventPasswordUpdated (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.sitePasswordUpdated(this.site);
  }

  @PactRabbitMqMessageProvider(RabbitMessagesEnum.SiteEventPasswordToggled)
  public async mockSiteEventPasswordToggled (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.sitePasswordToggled(this.site);
  }

  @PactRabbitMqMessageProvider(DomainRabbitmqEventsEnum.DomainUpdated)
  public async mockDomainUpdated (): Promise<void> {
    const producer = await this.getProvider<SiteMessagesProducer>(SiteMessagesProducer);
    await producer.siteDomainChanged(`bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`, 'new-domain');
  }
}
