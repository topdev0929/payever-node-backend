import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { BusinessLocalService } from './services';
import { RabbitChannelsEnum } from '../common/enums';

@Module({
  controllers: [ ],
  exports: [
    BusinessLocalService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchema },
      ],
    ),
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelsEnum.Social,
    }),
  ],
  providers: [
    BusinessLocalService,
  ],
})
export class LocalBusinessModule { }
