import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessMessagesConsumer } from './consumers';
import { BusinessService } from './services';
import { BusinessSchema, BusinessSchemaName } from './schemas';

@Module({
  controllers: [
    BusinessMessagesConsumer,
  ],
  exports: [
    BusinessService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: BusinessSchemaName, schema: BusinessSchema },
      ],
    ),
  ],
  providers: [
    BusinessService,
  ],
})
export class BusinessModule { }
