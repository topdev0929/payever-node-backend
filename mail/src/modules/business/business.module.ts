import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BusinessBusMessageController } from './controllers';
import { BusinessSchema } from './schemas';
import { BusinessMigrationService, BusinessService } from './services';
import { MailModule } from '../mail';

@Module({
  controllers: [
    BusinessBusMessageController,
  ],
  exports: [
    BusinessService,
  ],
  imports: [
    MailModule,
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: 'Business', schema: BusinessSchema },
      ],
    ),
  ],
  providers: [
    BusinessMigrationService,
    BusinessService,
  ],
})
export class BusinessModule { }
