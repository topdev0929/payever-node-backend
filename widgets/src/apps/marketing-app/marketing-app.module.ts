import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../../business/schemas';
import { MongooseModel as CommonMongooseModel } from '../../common/enums';
import { CampaignBusMessageController, CampaignController } from './controllers';

import { MongooseModel } from './enums';

import { CampaignEventsListener } from './listeners';
import { CampaignSchema } from './schemas';
import { CampaignAppService } from './services';

@Module({
  controllers: [
    CampaignBusMessageController,
    CampaignController,
  ],
  exports: [
    CampaignAppService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CommonMongooseModel.Business, schema: BusinessSchema },
        { name: MongooseModel.Campaign, schema: CampaignSchema },
      ],
    ),
  ],
  providers: [
    BusinessService,
    CampaignAppService,
    CampaignEventsListener,
  ],
})
export class MarketingAppModule { }
