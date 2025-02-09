import { Global, Module } from '@nestjs/common';
import { AlbumGateway } from './gateway';
import {
  WsClientService,
  WsAlbumService,
  WsAlbumSubscriptionService,
  WsSubscriptionService,
} from './services';
import { StudioModule } from '../studio';
import { BusinessModule } from '../business/business.module';

@Module({
  controllers: [],
  exports: [],
  imports: [
    BusinessModule,
    StudioModule,
  ],
  providers: [
    WsAlbumService,
    WsAlbumSubscriptionService,
    WsClientService,
    WsSubscriptionService,
    AlbumGateway,
  ],
})
@Global()
export class WebsocketsModule { }



