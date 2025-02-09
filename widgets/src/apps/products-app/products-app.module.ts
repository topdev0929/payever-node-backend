import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessModule } from '../../business';
import { BusinessSchema } from '../../business/schemas';
import { MongooseModel as CommonMongooseModel } from '../../common/enums';
import { StatisticsModule } from '../../statistics';
import { TransactionsAppModule } from '../transactions-app';
import { BusinessProductsController, ChannelSetProductsController, ProductsBusMessageController } from './controllers';
import { BusinessProductsEventsListener, ChannelSetProductsEmitterConsumer } from './listeners';
import { MongooseModel as ProductsMongooseModel } from './enums';
import {
  BusinessLastSoldProductsListSchema,
  BusinessProductAggregateSchema,
  ChannelSetLastSoldProductsListSchema,
  ChannelSetProductAggregateSchema,
} from './schemas';
import {
  BusinessProductsAppService,
  BusinessProductsService,
  ChannelSetProductsAppService,
  ChannelSetProductsService,
} from './services';
import { InvoiceAppModule } from '../invoice-app';

@Module({
  controllers: [
    BusinessProductsController,
    ChannelSetProductsController,
    ProductsBusMessageController,
  ],
  exports: [
    BusinessProductsService,
    BusinessProductsAppService,
    ChannelSetProductsService,
    ChannelSetProductsAppService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CommonMongooseModel.Business, schema: BusinessSchema },
        { name: ProductsMongooseModel.BusinessLastSoldProductsList, schema: BusinessLastSoldProductsListSchema },
        { name: ProductsMongooseModel.BusinessProductAggregate, schema: BusinessProductAggregateSchema },
        { name: ProductsMongooseModel.ChannelSetLastSoldProductsList, schema: ChannelSetLastSoldProductsListSchema },
        { name: ProductsMongooseModel.ChannelSetProductAggregate, schema: ChannelSetProductAggregateSchema },
      ],
    ),
    BusinessModule,
    StatisticsModule,
    TransactionsAppModule,
    InvoiceAppModule,
  ],
  providers: [
    BusinessService,
    BusinessProductsService,
    ChannelSetProductsService,
    BusinessProductsAppService,
    ChannelSetProductsAppService,
    BusinessProductsEventsListener,
    ChannelSetProductsEmitterConsumer,
  ],
})
export class ProductsAppModule { }
