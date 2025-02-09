import { HttpModule, Module } from '@nestjs/common';
import { BusinessModule } from '../business/business.module';
import { IntegrationRateController, ShippingIntegrationsController, ShippingRuleController } from './controllers';

@Module({
  controllers: [
    ShippingIntegrationsController,
    ShippingRuleController,
    IntegrationRateController,
  ],
  imports: [
    HttpModule,
    BusinessModule,
  ],
  providers: [],
})
export class ShippingModule { }
