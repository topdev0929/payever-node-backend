import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsSdkModule } from '@pe/notifications-sdk';
import { BusinessModule } from '@pe/business-kit';
import { IntegrationModule } from '../integration/integration.module';
import { ShippingModule } from '../shipping/shipping.module';
import { BusinessBusMessageController, BusinessController } from './controllers';
import { BusinessSchema, BusinessSchemaName } from './schemas';
import { BusinessServiceLocal } from './services';
import { BusinessEventListener } from './event-listeners';
import { ShippingDeafultProfileSetupCommand } from './commands';
import { RabbitChannelsEnum } from '../environments/rabbitmq';
@Module({
  controllers: [
    BusinessBusMessageController,
    BusinessController,
  ],
  exports: [
    BusinessServiceLocal,
  ],
  imports: [
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelsEnum.Shipping,
    }),
    HttpModule,
    ShippingModule,
    forwardRef(() => IntegrationModule),
    NotificationsSdkModule,
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
    ]),
  ],
  providers: [
    BusinessServiceLocal,
    BusinessEventListener,
    ShippingDeafultProfileSetupCommand,
  ],
})
export class BusinessModuleLocal { }
