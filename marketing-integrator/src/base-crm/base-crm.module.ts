import { HttpModule, HttpService, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BaseCrmClientService } from './services';
import { environment } from '../environment/environment';
import { EventDispatcher } from '@pe/nest-kit';

@Module({
  exports: [
    BaseCrmClientService,
  ],
  imports: [
    HttpModule,
  ],
  providers: [
    {
      inject: [HttpService, EventDispatcher],
      provide: BaseCrmClientService,
      useFactory: (httpService: HttpService, eventDispatcher: EventDispatcher): BaseCrmClientService =>
        new BaseCrmClientService(httpService, eventDispatcher, environment.baseCrm.accessToken),
    },
  ],
})
export class BaseCrmModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): any { }
}
