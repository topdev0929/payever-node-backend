import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { MessageModule } from '../message/message.module';
import { ProjectionsModule } from '../projections/projections.module';
import { WsService, WsGateway, WidgetWsGateway, WidgetWsService, UserOnlineStateService } from './services';
import { JoinRoomVoter, JoinBusinessRoomVoter } from './voters';
import { RedisConsumer } from './consumers';

@Module({
  imports: [
    JwtModule,
    MessageModule,
    ProjectionsModule,
  ],
  providers: [
    RedisConsumer,

    WsService,
    WsGateway,

    WidgetWsService,
    WidgetWsGateway,

    JoinRoomVoter,
    JoinBusinessRoomVoter,
    UserOnlineStateService,
  ],
})
export class WsModule { }
