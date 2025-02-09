import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessModule } from '@pe/business-kit';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { RabbitChannels } from '../enums';

@Module({
  controllers: [
  ],
  exports: [
    MongooseModule,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
    BusinessModule.forRoot(
      {
        customSchema: BusinessSchema,
        rabbitChannel: RabbitChannels.Transactions,
      },
    ),
  ],
  providers: [
  ],
})
export class LocalBusinessModule { }
