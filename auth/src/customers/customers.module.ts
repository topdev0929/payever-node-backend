import { EventDispatcherModule } from '@pe/nest-kit';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

import { UserModule, UserSchema, UserSchemaName } from '../users';
import { AuthModule } from '../auth';
import { ApplicationAccessController } from './controllers';
import { ApplicationAccessService } from './services';
@Module({
  controllers: [ ApplicationAccessController ],
  exports: [],
  imports: [
    EventDispatcherModule,
    UserModule,
    AuthModule,
    MongooseModule.forFeature([
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [ ApplicationAccessService ],
})
export class CustomersModule { }
