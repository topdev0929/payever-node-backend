import { HttpModule, Module } from '@nestjs/common';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { TestController } from './controllers';

import { environment } from '../environments';

@Module({
  controllers: [
    TestController,
  ],
  imports: [
    HttpModule,
    NotificationsSdkModule,
  ],
  providers: [],
})
export class TestModule { }
