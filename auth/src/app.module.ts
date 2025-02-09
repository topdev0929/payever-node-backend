import { BadRequestException, HttpException, HttpModule, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Error } from 'mongoose';
import { BusinessModule } from '@pe/business-kit';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
  MutexModule,
  ErrorHandlersEnum,
  ErrorsHandlerModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { CronModule } from '@pe/cron-kit';
import { SecondFactorModule } from './2fa/second-factor.module';
import { AuthModule } from './auth';
import { BusinessLocalSchema } from './business/schemas';
import { BruteForceModule } from './brute-force/brute-force.module';
import {
  BlockedException,
  CaptchaException,
  WrongPasswordException,
  RegisterCaptchaException,
  RegisterBlockedException,
} from './brute-force/exceptions';
import { EmployeesModule } from './employees/employees.module';
import { environment } from './environments';
import { OAuthModule } from './oauth';
import { RecaptchaModule } from './recaptcha/recaptcha.module';
import { PartnersModule } from './partners/partners.module';
import { CustomersModule } from './customers/customers.module';
import { EncryptionModule } from './encryption';
import { MessageBusChannelsEnum } from './common';
import { SocialModule } from './social/social.module';
import { OrganizationModule } from './organization';
import { MigrationModule } from '@pe/migration-kit';
import { SecurityQuestionModule } from './security-question/security-question.module';


@Module({
  imports: [
    BusinessModule.forRoot({
      customSchema: BusinessLocalSchema,
      rabbitChannel: MessageBusChannelsEnum.auth,
      useRPCCreatedMessage: true,
    }),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    MutexModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticSearchAuthPassword,
      authUsername: environment.elasticSearchAuthUsername,
      cloudId: environment.elasticSearchCloudId,
      host: environment.elasticSearchHost,
    }),
    ErrorsHandlerModule.forRoot([
      {
        exceptions: [BadRequestException],
        name: ErrorHandlersEnum.dtoValidation,
      },
      {
        exceptions: [
          WrongPasswordException,
          BlockedException,
          CaptchaException,
          RegisterCaptchaException,
          RegisterBlockedException,
        ],
        name: 'forbidden.handler',
      },
      {
        exceptions: [Error.ValidationError],
        name: ErrorHandlersEnum.uniqueEntity,
      },
      {
        exceptions: [HttpException],
        name: ErrorHandlersEnum.defaultHttp,
      },
    ]),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    CommandModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    EncryptionModule,
    SecurityQuestionModule,
    AuthModule,
    BruteForceModule,
    CustomersModule,
    EmployeesModule,
    OAuthModule,
    OrganizationModule,
    PartnersModule,
    RecaptchaModule,
    SecondFactorModule,
    SocialModule,
    MigrationModule,
    CronModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
