import { HttpModule, Logger, Module } from '@nestjs/common';

import { BusinessModule } from '@pe/business-kit';
import { MessageBusChannelsEnum } from './enums';
import { BusinessSchema } from './schemas';
import { BusinessEventListener } from './event-listeners/business-event.listener';

@Module({
  controllers: [
  ],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.channels,
    }),
  ],
  providers: [
    Logger,
    BusinessEventListener,
  ],
})
export class BusinessModuleLocal { }
