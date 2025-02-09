import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule as KitBusinessModule, BusinessSchemaName, BusinessSchemaFactory } from '@pe/business-kit';
import { MessageBusChannelsEnum } from '../inventory/enums';


@Module({
  controllers: [
  ],
  exports: [
    MongooseModule,
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customSchema: null,
      rabbitChannel: MessageBusChannelsEnum.inventory,
    }),
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchemaFactory.create(null) },
      ],
    ),
  ],
  providers: [
  ],
})
export class BusinessModule { }
