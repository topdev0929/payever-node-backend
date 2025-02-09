import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  LoginAttemptSchema,
  LoginAttemptSchemaName,
  RegisterAttemptSchema,
  RegisterAttemptSchemaName,
  SecurityQuestionAttemptSchema,
  SecurityQuestionAttemptSchemaName,
} from './schemas';
import { BlockListSchema, BlockListSchemaName } from './schemas/block-list.schema';
import { SecurityQuestionService, SuspiciousActivityService } from './services';
import { LoginListener, RegisterListener, SecurityQuestionListener, SecondFactorListener } from './event-listeners';
import { UserModule } from '../users';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  exports: [SuspiciousActivityService],
  imports: [
    MongooseModule.forFeature([
      {
        name: LoginAttemptSchemaName,
        schema: LoginAttemptSchema,
      },
      {
        name: BlockListSchemaName,
        schema: BlockListSchema,
      },
      {
        name: RegisterAttemptSchemaName,
        schema: RegisterAttemptSchema,
      },
      {
        name: SecurityQuestionAttemptSchemaName,
        schema: SecurityQuestionAttemptSchema,
      },
    ]),
    UserModule,
    EmployeesModule,
  ],
  providers: [
    SecurityQuestionService,
    SecondFactorListener,
    SuspiciousActivityService,
    LoginListener,
    RegisterListener,
    SecurityQuestionListener,
  ],
})
export class BruteForceModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
