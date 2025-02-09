import { Module, NestModule, MiddlewareConsumer, HttpModule, HttpService } from '@nestjs/common';
import { environment } from '../environment/environment';
import { GeckoboardDatasetService } from './services';
import { CreateDatasetsCommand, DeleteDatasetCommand, TruncateDatasetCommand } from './commands';
import { TransactionEventListener } from './event-listeners/transaction-event.listener';

@Module({
  imports: [
    HttpModule,
  ],

  providers: [
    {
      inject: [HttpService],
      provide: GeckoboardDatasetService,
      useFactory: (httpService: HttpService): GeckoboardDatasetService => {
        return new GeckoboardDatasetService(environment.geckoboard.apiKey, httpService);
      },
    },
    CreateDatasetsCommand,
    DeleteDatasetCommand,
    TruncateDatasetCommand,
    TransactionEventListener,
  ],

  exports: [
    GeckoboardDatasetService,
  ],
})
export class GeckoboardModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any { }
}
