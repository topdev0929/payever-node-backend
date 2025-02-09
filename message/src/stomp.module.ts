import { Module, Logger } from '@nestjs/common';
import { StompModule as StompClientModule } from '@pe/stomp-client';
import { IFrame, IMessage } from '@stomp/stompjs';
import { EventDispatcher } from '@pe/nest-kit';

import { environment } from './environments';

const stompBrokerUrlParsed: URL = new URL(environment.rabbitmq.stompBrokerUrl);

@Module({
  imports: [
    StompClientModule.forRootAsync({
      inject: [Logger, EventDispatcher],
      useFactory: (logger: Logger, eventDispatcher: EventDispatcher) => ({
        brokerURL: environment.rabbitmq.stompBrokerUrl,
        defaultPrefetchCount: environment.stompDefaultPrefetchCount,
        restartOnAckNackError: false,

        onErrorHandler: (err: any) => {
          logger.error(err, 'STOMP');
        },

        onSubscribeHandlerError: (
          err: any,
          message: IMessage,
        ) => {
          message.ack();
          void eventDispatcher.dispatch('stomp.subscriber.exception', err, message);
        },

        connectHeaders: {
          login: stompBrokerUrlParsed.username,
          passcode: stompBrokerUrlParsed.password,
        },
        debug: (str: string) => {
          environment.production || logger.debug(str, 'STOMP');
        },
        onConnect: (frame: IFrame) => {
          logger.log(frame, 'STOMP');
        },
        onStompError: (frame: IFrame) => {
          logger.error(frame, 'STOMP');
        },
        onWebSocketClose: (event: any) => {
          logger.error(event, 'StompClientModule:onWebSocketClose');
        },
      }),
    }),
  ],
})
export class LocalStompModule { }
