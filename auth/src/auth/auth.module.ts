import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { EventDispatcherModule, TokensGenerationService } from '@pe/nest-kit';
import { TokenCookieWriter } from '../common/token-to-response.writer';
import { SecondFactorModule } from '../2fa/second-factor.module';
import { BruteForceModule } from '../brute-force/brute-force.module';
import { BlockEmailModule } from '../blocked-email/block-email.module';
import { RmqSender } from '../common';
import { environment } from '../environments/environment';
import { UserModule } from '../users';
import { PermissionsController, TokensController, LocationsController } from './controllers';
import { ForbiddenErrorHandler } from './error-handlers/forbidden.handler';
import { LoginListener } from './event-listeners/login.listener';
import { ACLChangeListener } from './event-listeners/acl-change.listener';
import { RefreshStrategy } from './refresh.strategy';
import { LocationSchema, LocationSchemaName, RefreshTokenSchema, RefreshTokenSchemaName } from './schemas';
import { LocationMailerService, LocationService, TokenService } from './services';
import { EncryptionModule } from '../encryption';
import { BusinessEnabledEventProducer, TokenEventProducer } from './producer';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  controllers: [TokensController, PermissionsController, LocationsController],
  exports: [TokenService, LocationService, RmqSender],
  imports: [
    HttpModule,
    EventDispatcherModule,
    MongooseModule.forFeature([
      {
        name: RefreshTokenSchemaName,
        schema: RefreshTokenSchema,
      },
      {
        name: LocationSchemaName,
        schema: LocationSchema,
      },
    ]),
    TokensGenerationService,
    JwtModule.register(environment.jwtOptions),
    forwardRef(() => UserModule),
    forwardRef(() => SecondFactorModule),
    BruteForceModule,
    EncryptionModule,
    BlockEmailModule,
    EmployeesModule,
  ],
  providers: [
    LoginListener,
    ACLChangeListener,
    LocationService,
    LocationMailerService,
    TokenService,
    RefreshStrategy,
    RmqSender,
    TokenCookieWriter,
    ForbiddenErrorHandler,
    BusinessEnabledEventProducer,
    TokenEventProducer,
  ],
})
export class AuthModule { }
