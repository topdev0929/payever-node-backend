import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenCookieWriter } from '../common';

import { AuthModule } from '../auth';
import { UserModule } from '../users';
import { SecondFactorController } from './controllers';
import { SecondFactorTokenSchema, SecondFactorTokenSchemaName } from './schemas';
import { CodeNumberGenerator, SecondFactorService } from './services';
import { EventDispatcherModule } from '@pe/nest-kit';

@Module({
  controllers: [SecondFactorController],
  exports: [SecondFactorService, CodeNumberGenerator],
  imports: [
    EventDispatcherModule,
    MongooseModule.forFeature([
      {
        name: SecondFactorTokenSchemaName,
        schema: SecondFactorTokenSchema,
      },
    ]),
    UserModule,
    forwardRef(() => AuthModule),
  ],
  providers: [
    SecondFactorService,
    CodeNumberGenerator,
    TokenCookieWriter,
  ],
})
export class SecondFactorModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
