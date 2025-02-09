import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../../business/schemas';
import { MongooseModel as CommonMongooseModel } from '../../common/enums';
import { TransactionsController } from './controllers';

import { ChannelSetTransactionsController } from './controllers/channel-set-transactions.controller';
import { BusinessTransactionsEventsListener, ChannelSetTransactionsEventsListener } from './listeners';
import { MongooseModel } from './enums';
import {
  BusinessDayAmountSchema,
  BusinessMonthAmountSchema,
  ChannelSetDayAmountSchema,
  ChannelSetMonthAmountSchema,
  UserDayAmountSchema,
  UserMonthAmountSchema,
  UserPerBusinessDailyAmountSchema,
  UserPerBusinessMonthAmountSchema,
} from './schemas';
import {
  BusinessTransactionsService,
  ChannelSetTransactionsService,
  UserTransactionsService,
  UserPerBusinessTransactionsService,
  AdminTransactionsService,
} from './services';
import { WidgetModule } from '../../widget';
import { UserConsumer } from './consumers';

@Module({
  controllers: [
    TransactionsController,
    ChannelSetTransactionsController,
    UserConsumer,
  ],
  exports: [
    BusinessTransactionsService,
    ChannelSetTransactionsService,
    UserTransactionsService,
    UserPerBusinessTransactionsService,
    AdminTransactionsService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CommonMongooseModel.Business, schema: BusinessSchema },
        { name: MongooseModel.BusinessDayAmount, schema: BusinessDayAmountSchema },
        { name: MongooseModel.BusinessMonthAmount, schema: BusinessMonthAmountSchema },
        { name: MongooseModel.ChannelSetDayAmount, schema: ChannelSetDayAmountSchema },
        { name: MongooseModel.ChannelSetMonthAmount, schema: ChannelSetMonthAmountSchema },
        { name: MongooseModel.UserDayAmount, schema: UserDayAmountSchema },
        { name: MongooseModel.UserMonthAmount, schema: UserMonthAmountSchema },
        { name: MongooseModel.UserPerBusinessDayAmount, schema: UserPerBusinessDailyAmountSchema },
        { name: MongooseModel.UserPerBusinessMonthAmount, schema: UserPerBusinessMonthAmountSchema },
      ],
    ),
    WidgetModule,
  ],
  providers: [
    BusinessService,
    BusinessTransactionsService,
    AdminTransactionsService,
    UserTransactionsService,
    UserPerBusinessTransactionsService,
    ChannelSetTransactionsService,
    BusinessTransactionsEventsListener,
    ChannelSetTransactionsEventsListener,
  ],
})

export class TransactionsAppModule { }
