import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../business/schemas';
import { MongooseModel as CommonMongooseModel } from '../common/enums';
import { ProductsAppModule } from '../apps/products-app';
import { MongooseModel as ProductsModel } from '../apps/products-app/enums';
import { BusinessLastSoldProductsListSchema, ProductSchema } from '../apps/products-app/schemas';
import { MongooseModel as TransactionsModel } from '../apps/transactions-app/enums';
import {
  BusinessDayAmountSchema,
  BusinessMonthAmountSchema,
  ChannelSetDayAmountSchema,
  ChannelSetMonthAmountSchema,
  UserPerBusinessDailyAmountSchema,
  UserPerBusinessMonthAmountSchema,
} from '../apps/transactions-app/schemas';
import { MongooseModel as InvoiceModel } from '../apps/invoice-app/enums';
import {
  BusinessDayAmountSchema as InvoiceBusinessDayAmountSchema,
  BusinessMonthAmountSchema as InvoiceBusinessMonthAmountSchema,
} from '../apps/invoice-app/schemas';
import { 
  ChannelSetBusMessageController, 
  InvoiceBusMessageController, 
  TransactionsBusMessageController, 
} from './controllers';
import { ChannelSetEventsListener } from './listeners';
import { MongooseModel as StatisticsModel } from './enum';
import { ChannelSetSchema, TransactionSchema, InvoiceSchema } from './schemas';
import {
  BusinessIncomeService,
  ChannelSetIncomeService,
  ChannelSetService,
  TransactionsService,
  InvoiceService,
  UserIncomeService,
  InvoiceBusinessIncomeService,
} from './services';
import { UserModule } from '../user';

@Module({
  controllers: [
    ChannelSetBusMessageController,
    TransactionsBusMessageController,
    InvoiceBusMessageController,
  ],
  exports: [
    ChannelSetService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CommonMongooseModel.Business, schema: BusinessSchema },
        { name: ProductsModel.Product, schema: ProductSchema },
        { name: ProductsModel.BusinessLastSoldProductsList, schema: BusinessLastSoldProductsListSchema },
        { name: StatisticsModel.ChannelSet, schema: ChannelSetSchema },
        { name: StatisticsModel.Transaction, schema: TransactionSchema },
        { name: StatisticsModel.Invoice, schema: InvoiceSchema },
        { name: TransactionsModel.BusinessDayAmount, schema: BusinessDayAmountSchema },
        { name: TransactionsModel.BusinessMonthAmount, schema: BusinessMonthAmountSchema },
        { name: TransactionsModel.ChannelSetDayAmount, schema: ChannelSetDayAmountSchema },
        { name: TransactionsModel.ChannelSetMonthAmount, schema: ChannelSetMonthAmountSchema },
        { name: TransactionsModel.UserPerBusinessDayAmount, schema: UserPerBusinessDailyAmountSchema },
        { name: TransactionsModel.UserPerBusinessMonthAmount, schema: UserPerBusinessMonthAmountSchema },
        { name: InvoiceModel.BusinessDayAmount, schema: InvoiceBusinessDayAmountSchema },
        { name: InvoiceModel.BusinessMonthAmount, schema: InvoiceBusinessMonthAmountSchema },
      ],
    ),
    forwardRef(() => ProductsAppModule),
    UserModule,
  ],
  providers: [
    BusinessIncomeService,
    BusinessService,
    ChannelSetIncomeService,
    ChannelSetService,
    TransactionsService,
    ChannelSetEventsListener,
    UserIncomeService,
    InvoiceBusinessIncomeService,
    InvoiceService,
    Date,
  ],
})
export class StatisticsModule { }
