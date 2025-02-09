import { HttpModule, Module } from '@nestjs/common';
import { BusinessModule } from '@pe/business-kit';
import { BusinessController } from './controllers';
import { BusinessSchema } from './schemas';
import { MessageBusChannelsEnum } from '../blog/enums';
import { BusinessService } from './services/business.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessSchemaName } from '../mongoose-schema/mongoose-schema.names';

@Module({
  controllers: [
    BusinessController,
  ],
  exports: [
    BusinessService,
  ],
  imports: [
    HttpModule,
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.blog,
    }),
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
  ],
  providers: [
    BusinessService,
  ],
})
export class BusinessModuleLocal { }
