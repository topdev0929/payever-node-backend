import { HttpModule, Module } from '@nestjs/common';
import { BusinessModule as KitBusinessModule } from '@pe/business-kit';
import { BusinessSchema } from './schemas';
import { MessageBusChannelsEnum } from '../common';

@Module({
  controllers: [
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.thirdParty,
    }),
  ],
  providers: [
  ],
})
export class BusinessModule { }
