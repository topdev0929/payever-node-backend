import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule as KitBusinessModule } from '@pe/business-kit';

import { MongooseModel, MessageBusChannelsEnum } from '../common';
import { WidgetModule } from '../widget';
import { InstallAppCommand } from './commands';
import { BusinessSchema } from './schemas';
import { BusinessMigrationService } from './services';
import { UserService } from '../user/services';
import { UserSchema } from '../user/schemas';
import { BusinessEventListener } from './event-listeners';

@Module({
  controllers: [
  ],
  exports: [
  ],
  imports: [
    HttpModule,
    KitBusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: MessageBusChannelsEnum.widgets,
    }),
    MongooseModule.forFeature(
      [
        { name: MongooseModel.User, schema: UserSchema },
        { name: MongooseModel.Business, schema: BusinessSchema },
      ],
    ),
    WidgetModule,
  ],
  providers: [
    BusinessMigrationService,
    UserService,
    InstallAppCommand,
    BusinessEventListener,
  ],
})
export class BusinessModule { }
