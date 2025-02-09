import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventDispatcherModule } from '@pe/nest-kit';
import { BusinessBusController } from './controllers';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { BusinessService } from './services';
import { StudioModule } from '../studio';


import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  controllers: [
    BusinessBusController,
  ],
  exports: [
    BusinessService,
  ],
  imports: [
    HttpModule,
    EventDispatcherModule,
    forwardRef(() => StudioModule),
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
