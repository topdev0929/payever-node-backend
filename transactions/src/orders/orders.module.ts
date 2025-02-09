import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { EventDispatcherModule } from '@pe/nest-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { environment } from '../environments';
import { OrderSchema, OrderSchemaName } from './schemas';
import { FoldersConfig } from '../config';
import { OrderActionService, OrderService } from './services';
import { AttachTransactionToOrderListener, SendRabbitEventOrderListener } from './event-listeners';
import { CommonModule } from '../common/common.module';
import { OrdersEventProducer } from './producer';
import { OrderController } from './controllers';

@Module({
  controllers: [
    OrderController,
  ],
  exports: [
  ],
  imports: [
    MongooseModule.forFeature([
      { name: OrderSchemaName, schema: OrderSchema },
    ]),
    EventDispatcherModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticSearchAuthPassword,
      authUsername: environment.elasticSearchAuthUsername,
      cloudId: environment.elasticSearchCloudId,
      host: environment.elasticSearchHost,
    }),
    FoldersPluginModule.forFeature(FoldersConfig),

    CommonModule,
  ],
  providers: [
    AttachTransactionToOrderListener,
    SendRabbitEventOrderListener,

    OrderActionService,
    OrderService,

    OrdersEventProducer,
  ],
})
export class OrdersModule { }
