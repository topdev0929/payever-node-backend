import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppsConsumer } from './consumers';
import { BusinessModule } from '../business/business.module';
import { FixBusinessAppsCommand } from '../commands/fix-business-apps.command';
import { businessModel } from '../models/business.model';
import { dashboardAppModel } from '../models/dashboard-app.model';
import { defaultAppsModel } from '../models/default-apps.model';
import { originAppModel } from '../models/origin-app.model';
import { userModel } from '../models/user.model';
import { ExportBusinessAppInstallationsCommand } from './commands';
import { AdminAppsController } from './controllers/admin.apps.controller';
import { BusinessAppsController } from './controllers/business.apps.controller';
import { UserAppsController } from './controllers/user.apps.controller';
import { AppsEventsProducer } from './producers';
import { AdminService } from './services/admin.service';
import { BusinessAppsService } from './services/business.apps.service';
import { UserAppsService } from './services/user.apps.service';
import { UserService } from './services/user.service';
import { OriginAppService } from '../services/origin-app.service';
import { OnboardingModule } from '../onboarding/onboarding.module';

@Module({
  controllers: [
    // Consumers
    AppsConsumer,
    // Controllers
    BusinessAppsController,
    UserAppsController,
    AdminAppsController,
  ],
  imports: [
    HttpModule,
    OnboardingModule,
    MongooseModule.forFeature([
      {
        name: originAppModel.modelName,
        schema: originAppModel.schema,
      },
      {
        name: businessModel.modelName,
        schema: businessModel.schema,
      },
      {
        name: userModel.modelName,
        schema: userModel.schema,
      },
      {
        name: dashboardAppModel.modelName,
        schema: dashboardAppModel.schema,
      },
      {
        name: defaultAppsModel.modelName,
        schema: defaultAppsModel.schema,
      },
    ]),
    BusinessModule,
  ],
  providers: [
    AppsEventsProducer,
    BusinessAppsService,
    ExportBusinessAppInstallationsCommand,
    FixBusinessAppsCommand,
    UserAppsService,
    UserService,
    AdminService,
    OriginAppService,
  ],
})
export class AppsModule { }
