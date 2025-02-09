import { HttpModule, Module } from '@nestjs/common';
import { IntercomModule } from '@pe/nest-kit';
import { MongooseModule } from '@nestjs/mongoose';
import { OnboardingController } from './contollers';
import { CacheManager, OnboardingManager, ValidationService } from './services';
import { OnboardingSchemaName, OnboardingSchema } from './schemas';
import { AdminOnboardingController } from './contollers/admin-onboarding.controller';
import { OriginAppService } from '../services/origin-app.service';
import { originAppModel } from '../models/origin-app.model';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [
    OnboardingController,
    AdminOnboardingController,
  ],
  exports: [
    OnboardingManager,
  ],
  imports: [
    HttpModule,
    IntercomModule,
    BusinessModule,
    MongooseModule.forFeature([
      {
        name: originAppModel.modelName,
        schema: originAppModel.schema,
      },
      {
        name: OnboardingSchemaName,
        schema: OnboardingSchema,
      },
    ]),
  ],
  providers: [
    CacheManager,
    OnboardingManager,
    ValidationService,
    OriginAppService,
  ],
})
export class OnboardingModule { }
