import { HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  IntegrationSchema,
  IntegrationSchemaName,
  IntegrationSubscriptionSchema,
  IntegrationSubscriptionSchemaName,
} from '@pe/third-party-sdk';
import { BusinessService } from '@pe/business-kit';

import { BusinessSchema } from '../business/schemas';
import { BusinessSchemaName } from '../common/mongoose-schema.names';
import { InvoiceApiController } from './controllers/invoice-api-controller';
import { AccountingsApiService } from './services/accountings-api-service';

@Module({
  controllers: [
    InvoiceApiController,
  ],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: BusinessSchemaName,
        schema: BusinessSchema,
      },
      {
        name: IntegrationSchemaName,
        schema: IntegrationSchema,
      },
      {
        name: IntegrationSubscriptionSchemaName,
        schema: IntegrationSubscriptionSchema,
      },
    ]),
  ],
  providers: [
    AccountingsApiService,
    BusinessService,
  ],
})
// TODO: Debitoor API, not used at the moment
export class AccountingsModule { }
