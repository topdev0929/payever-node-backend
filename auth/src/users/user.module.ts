import { forwardRef, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from '../auth';
import { RmqSender } from '../common';
import { AuthRpcConsumer, TrustedDomainConsumer, UserConsumer } from './consumers';
import { AdminController, AppsBusMessageController, RabbitController, UserController } from './controllers';
import {
  PermissionSchema,
  PermissionSchemaName,
  TrustedDomainSchema,
  TrustedDomainSchemaName,
  UserSchema,
  UserSchemaName,
} from './schemas';
import { PermissionService, ProfileService, RegistrationService, TrustedDomainService, UserService } from './services';
import { BusinessPermissionEventProducer, MailerEventProducer } from './producer';
import { ExportNonInternalBusinessCommand, ExportUsersCommand, FixUsersCommand } from './commands';
import { TokenCookieWriter } from '../common/token-to-response.writer';
import { EmployeesModule } from '../employees/employees.module';
import { BruteForceModule } from '../brute-force/brute-force.module';
import { EncryptionModule } from '../encryption';
import { BlockEmailModule } from '../blocked-email/block-email.module';
import { UserEventProducer } from './producer/user-event.producer';

@Module({
  controllers: [
    // Consumers
    AuthRpcConsumer,
    TrustedDomainConsumer,
    UserConsumer,
    // Controllers
    AdminController,
    AppsBusMessageController,
    RabbitController,
    UserController,
  ],
  exports: [
    UserService,
    PermissionService,
    MailerEventProducer,
    RegistrationService,
    TrustedDomainService,
  ],
  imports: [
    MongooseModule.forFeature([
      {
        name: UserSchemaName,
        schema: UserSchema,
      },
      {
        name: PermissionSchemaName,
        schema: PermissionSchema,
      },
      {
        name: TrustedDomainSchemaName,
        schema: TrustedDomainSchema,
      },
    ]),
    forwardRef(() => AuthModule),
    forwardRef(() => EmployeesModule),
    EncryptionModule,
    forwardRef(() => BruteForceModule),
    BlockEmailModule,
  ],
  providers: [
    ExportUsersCommand,
    ExportNonInternalBusinessCommand,
    FixUsersCommand,
    UserService,
    MailerEventProducer,
    ProfileService,
    RegistrationService,
    RmqSender,
    TokenCookieWriter,
    PermissionService,
    BusinessPermissionEventProducer,
    UserEventProducer,
    TrustedDomainService,
  ],
})
export class UserModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
