import { FastifyAdapter } from '@nestjs/platform-fastify';
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
  RedisContext,
  SocketIOContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { MutexProvider } from '@pe/cucumber-sdk/module/mutex';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as qs from 'qs';
import { AppConfigurator } from './app.configurator';
import { CurrentDateContext } from '../step_definitions';
import { EventsGateway } from '../../src/ws/events.gateway';

dotenv.config({ });
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqContext,
    RabbitMqRpcContext,
    RedisContext,
    CurrentDateContext,
    SocketIOContext.forRoot({
      namespaces: {
        ws: { gateway: EventsGateway },
      }
    }),
  ],
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: {
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
    },
  },
  mongodb: env.MONGODB_URL,
  providers: [
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
    MutexProvider,
  ],
};
