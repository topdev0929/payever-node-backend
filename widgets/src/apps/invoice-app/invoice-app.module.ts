import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../../business/schemas';
import { MongooseModel as CommonMongooseModel } from '../../common/enums';

import { BusinessInvoiceEventsListener } from './listeners';
import { MongooseModel } from './enums';
import {
  BusinessDayAmountSchema,
  BusinessMonthAmountSchema,
} from './schemas';
import {
  BusinessInvoiceService,
} from './services';
import { WidgetModule } from '../../widget';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  controllers: [
    InvoiceController,
  ],
  exports: [
    BusinessInvoiceService,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature(
      [
        { name: CommonMongooseModel.Business, schema: BusinessSchema },
        { name: MongooseModel.BusinessDayAmount, schema: BusinessDayAmountSchema },
        { name: MongooseModel.BusinessMonthAmount, schema: BusinessMonthAmountSchema },
      ],
    ),
    WidgetModule,
  ],
  providers: [
    BusinessService,
    BusinessInvoiceService,
    BusinessInvoiceEventsListener,
  ],
})

export class InvoiceAppModule { }
