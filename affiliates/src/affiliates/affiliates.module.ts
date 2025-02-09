import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { EncryptionModule } from '@pe/nest-kit';

import {
  AffiliateSchema,
  AffiliateSchemaName,
  BusinessAffiliateSchema,
  BusinessAffiliateSchemaName,
  AffiliateBankSchema,
  AffiliateBankSchemaName,
  AffiliateBrandingSchema,
  AffiliateBrandingSchemaName,
  AffiliateBudgetSchema,
  AffiliateBudgetSchemaName,
  AffiliateCommissionSchema,
  AffiliateCommissionSchemaName,
  AffiliateContactSchema,
  AffiliateContactSchemaName,
  BusinessPaymentsSchema,
  BusinessPaymentsSchemaName,
  AffiliateProgramSchema,
  AffiliateProgramSchemaName,
  ProductSchema,
  ProductSchemaName,
  AccessConfigSchemaName,
  AccessConfigSchema,
  DomainSchemaName,
  DomainSchema,
} from './schemas';
import {
  AccessConfigService,
  AffiliateBanksService,
  AffiliateBrandingsService,
  AffiliateProgramsService,
  AffiliatesService,
  BusinessAffiliatesService,
  BusinessPaymentsService,
  CommonService,
  DomainService,
  OnPublishConsumerService,
} from './services';
import {
  AccessController,
  AdminAffiliateBrandingsController,
  AdminAffiliateProgramsController,
  AdminBusinessAffiliatesController,
  AffiliateBanksController,
  AffiliateBrandingsController,
  AffiliateProgramsController,
  BusinessAffiliatesController,
  BusinessPaymentsController,
  CommonController,
  DomainController,
} from './controllers';
import { BusinessAffiliateEditVoter } from './voters';
import { AffiliatesMessagesProducer } from './producers';
import { BusinessAffiliatesListener, AffiliateProgramsListener, AffiliateBrandingEventsListener } from './event-listeners';
import { RulesSdkModule } from '@pe/rules-sdk';
import { ProductsService } from './services/product.service';
import { BuilderMessagesConsumer, ProductsBusMessageConsumer } from './consumers';
import { FoldersConfig, RulesOptions } from './config';
import { AffiliatesProgramExportCommand } from './commands';
import { IntegrationModule } from '../integrations/integrations.module';
import { ApplicationTypesEnum, BuilderThemeModule } from '@pe/builder-theme-kit';
import { environment } from '../environments';
import { BusinessListener } from './event-listeners/business.listener';
import { RabbitChannelsEnum } from './enums';

@Module({
  controllers: [
    BusinessAffiliatesController,
    AffiliateBanksController,
    AffiliateBrandingsController,
    ProductsBusMessageConsumer,
    BuilderMessagesConsumer,
    AffiliateProgramsController,
    BusinessPaymentsController,
    AccessController,
    CommonController,
    DomainController,
    AdminBusinessAffiliatesController,
    AdminAffiliateBrandingsController,
    AdminAffiliateProgramsController,
  ],
  imports: [
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
    EncryptionModule.forRoot({
      masterKey: environment.encryptionOptions.masterKey,
    }),

    MongooseModule.forFeature(
      [
        { name: AffiliateSchemaName, schema: AffiliateSchema },
        { name: BusinessAffiliateSchemaName, schema: BusinessAffiliateSchema },
        { name: AccessConfigSchemaName, schema: AccessConfigSchema },
        { name: DomainSchemaName, schema: DomainSchema },
        { schema: AffiliateBankSchema, name: AffiliateBankSchemaName },
        { schema: AffiliateBrandingSchema, name: AffiliateBrandingSchemaName },
        { schema: AffiliateBudgetSchema, name: AffiliateBudgetSchemaName },
        { schema: AffiliateCommissionSchema, name: AffiliateCommissionSchemaName },
        { schema: AffiliateContactSchema, name: AffiliateContactSchemaName },
        { schema: BusinessPaymentsSchema, name: BusinessPaymentsSchemaName },
        { schema: AffiliateProgramSchema, name: AffiliateProgramSchemaName },
        { schema: ProductSchema, name: ProductSchemaName },
      ],
    ),
    BuilderThemeModule.forRoot({
      applicationSchema: AffiliateBrandingSchema,
      applicationSchemaName: 'affiliatebrandings',
      applicationType: ApplicationTypesEnum.Affiliate,
      channel: RabbitChannelsEnum.Affiliates,
      redisUrl: environment.redis.url,
    }),
    IntegrationModule,
  ],
  providers: [
    AffiliatesProgramExportCommand,
    AffiliatesService,
    AffiliateBrandingsService,
    AffiliateBanksService,
    BusinessAffiliatesService,
    BusinessAffiliateEditVoter,
    AffiliatesMessagesProducer,
    BusinessAffiliatesListener,
    BusinessListener,
    AffiliateBrandingEventsListener,
    ProductsService,
    BusinessPaymentsService,
    AffiliateProgramsService,
    AffiliateProgramsListener,
    AccessConfigService,
    CommonService,
    DomainService,
    OnPublishConsumerService,
  ],
})

export class AffiliatesModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
