import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule as KitBusinessModule, BusinessSchemaName } from '@pe/business-kit';
import { BusinessController } from './controllers';
import { BusinessSchema } from './schemas';
import { MessageBusChannelsEnum } from '../terminal/enums';

@Module({
  controllers: [
    BusinessController,
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.pos,
    }),
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchema },
      ],
    ),
  ],
  providers: [
  ],
})
export class BusinessModule { }
