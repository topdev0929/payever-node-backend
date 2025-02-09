import { HttpModule, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppRegistryDashboardModule } from '@pe/app-registry-sdk';
import {
  ApmModule,
  CommandModule,
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
} from '@pe/nest-kit';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import { StatusModule } from '@pe/nest-kit/modules/status';
import { AppsModule } from './apps/apps.module';
import { BusinessModule } from './business/business.module';
import { environment } from './environments/environment';
import { StepperModule } from './stepper/stepper.module';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { MigrationModule } from '@pe/migration-kit/module/migration.module';
import { OnboardingModule } from './onboarding/onboarding.module';

@Module({
  imports: [
    CommandModule,
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    HttpModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    AppsModule,
    StatusModule.forRoot({
      mongodbUrl: environment.mongodb,
      sideAppPort: environment.statusPort,
    }),
    NotificationsSdkModule,
    BusinessModule,
    ApmModule.forRoot(environment.apm.enable, environment.apm.options),
    AppRegistryDashboardModule,
    RabbitMqModule.forRoot(environment.rabbitmq),
    EventDispatcherModule,
    StepperModule,
    OnboardingModule,
    MigrationModule,
  ],
})
export class ApplicationModule implements NestModule {
  public configure(): void { }
}
