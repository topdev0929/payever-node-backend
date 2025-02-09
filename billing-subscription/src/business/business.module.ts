import { HttpModule, Logger, Module } from '@nestjs/common';

import { BusinessModule } from '@pe/business-kit';
import { BusinessSchema } from './schemas';
import { RabbitChannelsEnum } from '../environments';

@Module({
  controllers: [],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelsEnum.BillingSubscription,
    }),
  ],
  providers: [
    Logger,
  ],
})
export class BusinessModuleLocal { }
