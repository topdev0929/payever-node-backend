import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { businessModel } from '../models/business.model';
import { defaultAppsModel } from '../models/default-apps.model';
import {
  BusinessBusMessageController,
  BusinessProductsController,
  BusinessRegistrationController,
} from './controllers';
import {
  BusinessProductIndustrySchema,
  BusinessProductIndustrySchemaName,
  BusinessProductSchema,
  BusinessProductSchemaName,
} from './schemas';
import { BusinessProductsService, BusinessService, NotifierService } from './services';

@Module({
  controllers: [
    BusinessBusMessageController,
    BusinessProductsController,
    BusinessRegistrationController,
  ],
  exports: [
    BusinessService,
    NotifierService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: businessModel.modelName,
        schema: businessModel.schema,
      },
      {
        name: defaultAppsModel.modelName,
        schema: defaultAppsModel.schema,
      },
      {
        name: BusinessProductSchemaName,
        schema: BusinessProductSchema,
      },
      {
        name: BusinessProductIndustrySchemaName,
        schema: BusinessProductIndustrySchema,
      },
    ]),
  ],
  providers: [
    BusinessProductsService,
    BusinessService,
    NotifierService,
  ],
})
export class BusinessModule { }
