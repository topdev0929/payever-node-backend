import { HttpModule, MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth';
import { OrganizationModule } from '../organization';
import { UserModule, UserSchema, UserSchemaName } from '../users';
import { RpcOauthConsumer } from './consumers';
import {
  ClientsController,
  OAuthController,
  OAuthSignatureController,
  V3OAuthController,
  V3OAuthSignatureController,
} from './controllers';
import { OAuthRabbitEventsProducer } from './producers';
import { OAuthClientSchema, OAuthClientSchemaName, LoggingSchema, LoggingSchemaName } from './schemas';
import { OAuthService, ResponseInterceptor, ScopeService, SignatureService } from './services';

@Module({
  controllers: [
    // Consumers
    RpcOauthConsumer,
    // Controllers
    ClientsController,
    OAuthController,
    OAuthSignatureController,
    V3OAuthController,
    V3OAuthSignatureController,
  ],
  exports: [
    OAuthService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: OAuthClientSchemaName,
        schema: OAuthClientSchema,
      },
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: LoggingSchemaName,
        schema: LoggingSchema,
      },
    ]),
    UserModule,
    AuthModule,
    OrganizationModule,
  ],
  providers: [
    OAuthService,
    OAuthRabbitEventsProducer,
    ResponseInterceptor,
    ScopeService,
    SignatureService,
  ],
})
export class OAuthModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
