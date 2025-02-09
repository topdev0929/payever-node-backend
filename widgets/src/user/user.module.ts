import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseModel } from '../common';

import { WidgetModule } from '../widget';
import { InstallUserWidgetsCommander } from './commands';
import { UserBusMessageController } from './controllers';
import { UserSchema } from './schemas';
import { UserService } from './services';

@Module({
  controllers: [
    UserBusMessageController,
  ],
  exports: [
    UserService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: MongooseModel.User, schema: UserSchema },
      ],
    ),
    WidgetModule,
  ],
  providers: [
    InstallUserWidgetsCommander,
    UserService,
  ],
})
export class UserModule { }
