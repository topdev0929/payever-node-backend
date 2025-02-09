import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EventDispatcherModule, IntercomModule } from '@pe/nest-kit';
import { ElasticSearchModule } from '@pe/elastic-kit';
import { FoldersPluginModule } from '@pe/folders-plugin';
import { AnonymizeOldTransactionsCron } from './crons';
import { BusinessEventListener, PrepareValuesListener } from './event-listeners';
import {
  ArchivedTransactionSchema,
  ArchivedTransactionSchemaName,
} from './schemas';
import {
  ArchivedTransactionService,
} from './services';
import { LocalBusinessModule } from '../business';
import { TransactionsModule } from '../transactions/transactions.module';
import { FoldersConfig } from '../config';
import { environment } from '../environments';
import { ArchivedTransactionsController } from './controllers';
import { AnonymizeTransactionsConsumer } from './consumers';

@Module({
  controllers: [
    ArchivedTransactionsController,
    AnonymizeTransactionsConsumer,
  ],
  exports: [
    ArchivedTransactionService,
  ],
  imports: [
    ConfigModule,
    HttpModule,
    IntercomModule,
    MongooseModule.forFeature([
      {
        name: ArchivedTransactionSchemaName,
        schema: ArchivedTransactionSchema,
      },
    ]),
    EventDispatcherModule,
    ElasticSearchModule.forRoot({
      authPassword: environment.elasticSearchAuthPassword,
      authUsername: environment.elasticSearchAuthUsername,
      cloudId: environment.elasticSearchCloudId,
      host: environment.elasticSearchHost,
    }),

    FoldersPluginModule.forFeature(FoldersConfig),
    LocalBusinessModule,
    TransactionsModule.forRoot(),
  ],
  providers: [
    // Crons
    AnonymizeOldTransactionsCron,
    // Listeners
    BusinessEventListener,
    PrepareValuesListener,
    // Services
    ArchivedTransactionService,
  ],
})
export class ArchivedTransactionsModule { }
