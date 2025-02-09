import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BusinessModule } from '@pe/business-kit';
import {
  BusinessSchema,
  BusinessSchemaName,
  ProductSchema,
  ProductSchemaName,
  ProductSubscriptionSchema,
  ProductSubscriptionSchemaName,
} from './schemas';
import { ProductsController, ProductSubscriptionsController } from './controllers/http';
import { ProductsBusController } from './controllers/rabbit';
import {
  MarketplaceChannelSetsService,
  ProductMessagesProducer,
  ProductsService,
  ProductSubscriptionsService,
} from './services';
import { ProductDeleteVoter, ProductUpdateVoter } from './voters';
import { ProductListener, ProductSubscriptionListener } from './event-listeners';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { RulesSdkModule } from '@pe/rules-sdk';
import { RulesOptions, FoldersConfig } from './config';
import { RabbitChannelsEnum } from './enums';

@Module({
  controllers: [
    ProductsController,
    ProductSubscriptionsController,
    ProductsBusController,
  ],
  imports: [
    BusinessModule.forRoot({
      customSchema: BusinessSchema,
      rabbitChannel: RabbitChannelsEnum.Marketplace,
    }),
    MongooseModule.forFeature([
      { name: BusinessSchemaName, schema: BusinessSchema },
      { name: ProductSchemaName, schema: ProductSchema },
      { name: ProductSubscriptionSchemaName, schema: ProductSubscriptionSchema },
    ]),
    FoldersPluginModule.forFeature(FoldersConfig),
    RulesSdkModule.forRoot(RulesOptions),
  ],
  providers: [
    ProductsService,
    ProductUpdateVoter,
    ProductDeleteVoter,
    ProductSubscriptionsService,
    ProductSubscriptionListener,
    ProductMessagesProducer,
    MarketplaceChannelSetsService,
    ProductListener,
  ],
})

export class MarketplaceModule implements NestModule {
  public configure(): MiddlewareConsumer | void { }
}
