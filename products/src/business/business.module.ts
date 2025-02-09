import { Module } from '@nestjs/common';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessMessageBusController } from './controllers';
import { BusinessService } from './services';

@Module({
  controllers: [
    BusinessMessageBusController,
  ],
  exports: [
    BusinessService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
  ],
  providers: [
    BusinessService,
  ],
})
export class BusinessModule { }
