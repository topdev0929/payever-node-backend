import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizationCheckerService } from '@pe/nest-kit';
import { CollectorModule } from '@pe/nest-kit/modules/collector-pattern';
import { PubSub } from 'graphql-subscriptions';
import { environment } from '../../environments';
import { BusinessModule, BusinessSchema } from '../business';
import { CreateVoter, DeleteVoter, ReadVoter, UpdateVoter } from '../business/voters';
import { MailModule } from '../mail';
import {
  BusinessSchemaName,
  CampaignSchemaName,
  CategorySchemaName,
  ContactSchemaName,
  ScheduleSchemaName,
  StatSchemaName,
} from '../mongoose-schema/mongoose-schema.names';
import { ProcessScheduleMessagesConsumer } from './consumers';
import {
  AdminCampaignController, AdminScheduleController, CampaignCronMessageBusController,
  ProductMessageBusController,
} from './controllers';
import { CampaignCron, CampaignDataSender } from './cron-handler';
import { CampaignEmitterConsumer } from './emitter';
import { CampaignEventsProducer } from './producers';
import { BrowserServiceProvider } from './providers';
import { BrowserPageLockServiceProvider } from './providers/browser-page-lock-service.provider';
import { CampaignResolver } from './resolvers';
import { CategoryResolver } from './resolvers/category.resolver';
import { ContactResolver } from './resolvers/contact.resolver';
import { CampaignSchema, CategorySchema, CronTaskSchema, CronTaskSchemaName, StatSchema } from './schemas';
import { ContactSchema } from './schemas/contact.schema';
import { ScheduleSchema } from './schemas/schedule.schema';
import {
  CampaignCronService,
  CampaignService,
  CategoryService,
  ContactService,
  CronManagerService,
  EmailService,
  ScheduleService,
  ThemeService,
} from './services';
import { ScheduleNowStrategy, ScheduleOnDateStrategy, SchedulePeriodicAfterDateStrategy } from './strategies/schedules';

@Module({
  controllers: [
    AdminCampaignController,
    AdminScheduleController,
    CampaignCronMessageBusController,
    ProcessScheduleMessagesConsumer,
    ProductMessageBusController,
  ],
  exports: [CampaignService],
  imports: [
    AuthorizationCheckerService,
    BusinessModule,
    CollectorModule,
    HttpModule,
    MailModule,
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
      { name: CampaignSchemaName, schema: CampaignSchema },
      { name: CronTaskSchemaName, schema: CronTaskSchema },
      { name: StatSchemaName, schema: StatSchema },
      { name: CategorySchemaName, schema: CategorySchema },
      { name: ScheduleSchemaName, schema: ScheduleSchema },
      { name: ContactSchemaName, schema: ContactSchema },
    ]),
  ],
  providers: [
    BrowserPageLockServiceProvider(environment.redis.url),
    BrowserServiceProvider(),
    CampaignCron,
    CampaignCronService,
    CampaignDataSender,
    CampaignEmitterConsumer,
    CampaignEventsProducer,
    CampaignResolver,
    CampaignService,
    CategoryResolver,
    CategoryService,
    CreateVoter,
    CronManagerService,
    ContactResolver,
    ContactService,
    DeleteVoter,
    EmailService,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
    ReadVoter,
    ScheduleNowStrategy,
    ScheduleOnDateStrategy,
    SchedulePeriodicAfterDateStrategy,
    ScheduleService,
    ThemeService,
    UpdateVoter,
  ],
})
export class CampaignModule {
}
