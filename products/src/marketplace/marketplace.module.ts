import { HttpModule, Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MarketplaceService, SubscriptionService, MarketplaceAssigmentService } from './services';
import { ThirdPartyBusMessageController } from './controllers';
import {
  MarketplaceSchema,
  MarketplaceSchemaName,
  SubscriptionSchemaName,
  SubscriptionSchema,
  MarketplaceAssigmentSchema,
  MarketplaceAssigmentSchemaName,
} from './schemas';

@Module({
  controllers: [ThirdPartyBusMessageController],
  exports: [MarketplaceService, MarketplaceAssigmentService, SubscriptionService],
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: MarketplaceSchemaName, schema: MarketplaceSchema },
      { name: MarketplaceAssigmentSchemaName, schema: MarketplaceAssigmentSchema },
      { name: SubscriptionSchemaName, schema: SubscriptionSchema },
    ]),
  ],
  providers: [MarketplaceService, MarketplaceAssigmentService, SubscriptionService],
})
export class MarketPlaceModule implements NestModule {
  constructor(private readonly logger: Logger) { }

  public configure(consumer: MiddlewareConsumer): void { }
}
