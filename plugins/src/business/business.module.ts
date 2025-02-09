import { HttpModule, Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule as KitBusinessModule } from '@pe/business-kit';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { MessageBusChannelsEnum } from '../environments';

@Module({
  controllers: [
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.plugins,
    }),
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchema },
      ],
    ),
  ],
  providers: [
    Logger,
  ],
})
export class BusinessModule { }
