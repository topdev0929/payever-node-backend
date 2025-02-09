import { FastifyAdapter } from '@nestjs/platform-fastify';
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
  RabbitMqRpcContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { AppConfigurator } from './app.configurator';

dotenv.config({});
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    HttpContext,
    StorageContext,
    RabbitMqContext,
    RabbitMqRpcContext,
    AxiosContext,
    LoggerContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: {
    },
  },
  mongodb: env.MONGODB_URL,
  providers: [HttpProvider, InMemoryProvider, RabbitMqProvider, RedisProvider],
};
