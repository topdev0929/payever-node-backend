
import { MiddlewareConsumer, Module, NestModule, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth';
import { UserModule } from '../users';
import { SecondFactorModule } from '../2fa/second-factor.module';
import { BruteForceModule } from '../brute-force/brute-force.module';
import { FacebookRegisterStrategy } from './facebook-register.strategy';
import { GoogleRegisterStrategy } from './google-register.strategy';
import { FacebookLoginStrategy } from './facebook-login.strategy';
import { GoogleLoginStrategy } from './google-login.strategy';
import { FacebookController, GoogleController, SocialController } from './controllers';
import { SocialLoginService } from './services';
import { TokenCookieWriter } from '../common/token-to-response.writer';
import { SocialSchemaName, SocialSchema } from './schemas';
import { SocialUpdateVoter, SocialDeleteVoter } from './voters';

@Module({
  controllers: [
    FacebookController,
    GoogleController,
    SocialController,
  ],
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: SocialSchemaName,
        schema: SocialSchema,
      },
    ]),
    forwardRef(() => UserModule),
    BruteForceModule,
    SecondFactorModule,
  ],
  providers: [
    FacebookLoginStrategy,
    FacebookRegisterStrategy,
    SocialLoginService,
    TokenCookieWriter,
    GoogleLoginStrategy,
    GoogleRegisterStrategy,
    SocialUpdateVoter,
    SocialDeleteVoter,
  ],
})
export class SocialModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
