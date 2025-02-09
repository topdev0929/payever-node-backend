import { HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RecaptchaController } from './controllers';
import { Recaptcha } from './services/recaptcha.service';
import { BlockListSchema, BlockListSchemaName } from '../brute-force/schemas/block-list.schema';
import { UserSchema, UserSchemaName } from '../users/schemas';
import {
  LoginListener,
  RegisterListener,
  ForgotPasswordListener,
  ConfirmEmployeeListener,
  SecurityQuestionListener,
} from './event-listeners';

@Module({
  controllers: [RecaptchaController],
  exports: [Recaptcha],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: UserSchemaName, schema: UserSchema},
      { name: BlockListSchemaName, schema: BlockListSchema},
    ]),
  ],
  providers: [
    Recaptcha,
    LoginListener,
    SecurityQuestionListener,
    RegisterListener,
    ForgotPasswordListener,
    ConfirmEmployeeListener,
  ],
})
export class RecaptchaModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
