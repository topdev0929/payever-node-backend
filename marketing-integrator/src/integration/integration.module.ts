import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IntercomModule } from '@pe/nest-kit';
import { BusinessModule } from '@pe/business-kit';

import { BaseCrmModule } from '../base-crm';
import { MailboxModule } from '../mailbox';
import { MailchimpModule } from '../mailchimp';
import { GeckoboardModule } from '../geckboard';
import { SignupsModule } from '../signups';
import { FollowupModule } from '../followup';

import { CronManager } from './cron';
import {
  BaseCrmContactsCommand,
  BaseCrmImportBusinessesCommand,
  MailchimpContactsCommand,
  UpdateContactsStatusCommand,
} from './commands/';
import {
  ApplicationEventsController,
  PaymentEventsController,
  UserEventsController,
} from './controllers';
import {
  BaseCrmService,
  BusinessDetailsResolverService,
  BusinessSynchronizerService,
} from './services';
import { SignupsEventListener, BusinessEventListener } from './event-listeners';
import { rabbitChannelMarketingIntegrator } from './enum';

@Module({
  controllers: [
    ApplicationEventsController,
    PaymentEventsController,
    UserEventsController,
  ],
  imports: [
    SignupsModule,
    FollowupModule,
    GeckoboardModule,
    BaseCrmModule,
    IntercomModule,
    MailboxModule,
    MailchimpModule,
    BusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: rabbitChannelMarketingIntegrator,
    }),
  ],

  exports: [
    BaseCrmModule,
    MailboxModule,
    MailchimpModule,
    BaseCrmContactsCommand,
    MailchimpContactsCommand,
    BaseCrmImportBusinessesCommand,
    UpdateContactsStatusCommand,
    CronManager,
  ],
  providers: [
    BaseCrmService,
    SignupsEventListener,
    BusinessEventListener,
    BusinessDetailsResolverService,
    BusinessSynchronizerService,
    BaseCrmContactsCommand,
    MailchimpContactsCommand,
    BaseCrmImportBusinessesCommand,
    UpdateContactsStatusCommand,
    CronManager,
  ],
})
export class IntegrationModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any {}
}
