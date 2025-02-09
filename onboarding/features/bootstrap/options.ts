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
  LoggerContext,
  RabbitMqContext,
  StorageContext,
  WorldContext,
  RabbitMqRpcContext,
  RedisContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { AppConfigurator } from './app.configurator';

dotenv.config({});
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    LoggerContext,
    HttpContext,
    StorageContext,
    RabbitMqContext,
    RabbitMqRpcContext,
    AxiosContext,
    RedisContext,
  ],
  dataPath: path.resolve('./features/fixtures'),
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: { },
  },
  mongodb: env.MONGODB_URL,
  providers: [
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
  ],
};
