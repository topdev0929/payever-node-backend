import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSdkModule } from '@pe/notifications-sdk';

import {
  DomainSchema,
  DomainSchemaName,
  SiteAccessConfigSchema,
  SiteAccessConfigSchemaName,
  SiteSchema,
  SiteSchemaName,
  BusinessSchema,
} from './schemas';

import { SiteExportCommand, SiteEsExportCommand, DeleteInactiveSiteCommand } from './commands';
import { BuilderMessagesConsumer, DeleteNonInternalBusinessConsumer, ElasticConsumer, RpcConsumer } from './consumers';
import {
  AdminDomainsController,
  AdminSiteAccessController,
  AdminSitesController,
  DomainController,
  SiteAccessController,
  SiteByDomainController,
  SiteController,
} from './controllers';
import {
  BusinessListener,
  ChannelSetRemoverListener,
  SiteLiveToggledListener,
  SitePasswordChangedListener,
  SiteRenamedListener,
  SiteListener,
} from './event-listeners';
import { SiteMessagesProducer } from './producers';
import { DomainRepository, SiteAccessConfigsRepository, SitesRepository } from './repositories';
import {
  DomainService,
  OnPublishConsumerService,
  SitesService,
  SiteTokensService,
  SiteElasticService,
} from './services';

import {
  SiteMerchantAccessVoter,
  SiteEditVoter,
  PublicSiteAccessVoter,
  PrivateSiteApprovedAccessVoter,
  PrivateSitePasswordAccessVoter,
} from './voters';
import { BusinessModule, BusinessSchemaName } from '@pe/business-kit';
import { CommonService } from './services/common.service';
import { DomainCheckQueueService } from './cron-handlers/domain-check-queue.service';
import { RabbitChannelsEnum } from '../sites/enums';

@Module({
  controllers: [
    RpcConsumer,
    BuilderMessagesConsumer,
    DeleteNonInternalBusinessConsumer,
    ElasticConsumer,

    SiteByDomainController,
    DomainController,
    SiteAccessController,
    SiteController,
    // Admin Controlelrs
    AdminSitesController,
    AdminDomainsController,
    AdminSiteAccessController,
  ],
  exports: [
    SiteAccessConfigsRepository,
    SitesRepository,
  ],
  imports: [
    HttpModule,
    NotificationsSdkModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelsEnum.Site,
    }),
    MongooseModule.forFeature([
      { name: SiteSchemaName, schema: SiteSchema },
      { name: SiteAccessConfigSchemaName, schema: SiteAccessConfigSchema },
      { name: DomainSchemaName, schema: DomainSchema },
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
  ],
  providers: [
    SiteExportCommand,
    SiteEsExportCommand,
    DeleteInactiveSiteCommand,
    SiteAccessConfigsRepository,
    SiteMessagesProducer,
    SiteLiveToggledListener,
    SitePasswordChangedListener,
    SiteRenamedListener,
    BusinessListener,
    SiteListener,
    SitesRepository,
    SiteMerchantAccessVoter,
    SiteEditVoter,
    PublicSiteAccessVoter,
    PrivateSiteApprovedAccessVoter,
    PrivateSitePasswordAccessVoter,
    DomainRepository,
    ChannelSetRemoverListener,
    DomainService,
    CommonService,
    OnPublishConsumerService,
    SitesService,
    SiteTokensService,
    SiteElasticService,
    DomainCheckQueueService,
  ],
})
export class SitesModule { }
