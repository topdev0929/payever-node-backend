import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider,
  RabbitMqContext,
  RabbitMqRpcContext,
  StorageContext,
  WorldContext,
  CurrentDateContext,
  CommandContext,
  CommandProvider,
  EventDispatcherContext,
  EventDispatcherProvider,
  RedisContext,
  EncryptionContext,
} from '@pe/cucumber-sdk/module';

import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { StompProvider } from '@pe/cucumber-sdk/module/stomp';
import { StompContext } from '@pe/cucumber-sdk/module/contexts/stomp.context';
import { AppConfigurator } from './app.configurator';
import { WebsocketProvider } from '../step_definitions/socket-io.provider';
import { SocketIoEmitterProvider } from '../step_definitions/socket-io-emitter.provider';
import { WidgetWsGateway, WsGateway } from '../../src/ws/services';
import { SocketIOContext } from '@pe/cucumber-sdk';


dotenv.config({ });
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    SocketIOContext.forRoot({
      namespaces:{
        chat:{
          gateway: WsGateway,
          waitForInitialEvents:[
            {resolve: 'authenticated', reject:'unauthorized' }
          ],
        },
        widget:{
          gateway: WidgetWsGateway,
          waitForInitialEvents:[
            {resolve: 'authenticated', reject:'unauthorized' }
          ],
        }
      }
    }),
    AuthContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqContext,
    RabbitMqRpcContext,
    CurrentDateContext,
    EncryptionContext,
    CommandContext,
    RedisContext,
    DatabaseContext,
    StompContext,
    ElasticsearchContext,
    EventDispatcherContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: { },
  },
  mongodb: env.MONGODB_URL,
  providers: [
    ElasticSearchProvider,
    CommandProvider,
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
    StompProvider,
    WebsocketProvider,
    EventDispatcherProvider,
    SocketIoEmitterProvider,
  ],
};
