import { Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestKitLoggingModule } from '@pe/nest-kit/modules/logging';
import {
  DefaultMongooseConfig,
  EventDispatcherModule,
  JwtAuthModule,
  RabbitMqModule,
  RedisModule,
  CommandModule,
  EncryptionModule,
} from '@pe/nest-kit';
import { StompModule as StompClientModule } from '@pe/stomp-client';
import { IMessage } from '@stomp/stompjs';

import { environment } from '../src/environments';

import { MessagesConsumerModule } from '../src/consumer/consumer.module';

import { MessagesHttpModule } from '../src/http/http.module';
import { ThemeModule } from '../src/themes';
import { ContentModule } from '../src/contents/content.module';
import { WsModule } from '../src/ws/ws.module';
import { ApplicationBuilderThemeModule } from "../src/application-builder-theme";

const stompBrokerUrlParsed: URL = new URL(environment.rabbitmq.stompBrokerUrl);

@Module({
  imports: [
    StompClientModule.forRoot({
      brokerURL: environment.rabbitmq.stompBrokerUrl,
      restartOnAckNackError: false,

      onErrorHandler: (err: any) => {
      },

      onSubscribeHandlerError: (
        err: any,
        message: IMessage,
      ) => {
        message.ack();
        // tslint:disable-next-line: no-console
        console.error(err);
      },

      connectHeaders: {
        login: stompBrokerUrlParsed.username,
        passcode: stompBrokerUrlParsed.password,
      },
    }),
    CommandModule,
    EventDispatcherModule,
    MongooseModule.forRoot(
      environment.mongodb,
      DefaultMongooseConfig,
    ),
    JwtAuthModule.forRoot(environment.jwtOptions),
    RedisModule.forRoot(environment.redis),
    RabbitMqModule.forRoot(environment.rabbitmq),
    NestKitLoggingModule.forRoot({
      applicationName: environment.applicationName,
      isProduction: environment.production,
    }),
    EncryptionModule.forRoot(environment.encryption),
    MessagesConsumerModule,
    MessagesHttpModule,
    ThemeModule,
    ContentModule,
    WsModule,
    ApplicationBuilderThemeModule,
  ],
})
export class CucumberAppModule implements NestModule {
  public configure(): void { }
}
