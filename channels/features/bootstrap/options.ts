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
  RedisContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { AppConfigurator } from './app.configurator';

import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config({});
const env: ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AxiosContext,
    AuthContext,
    DatabaseContext,
    HttpContext,
    LoggerContext,
    StorageContext,
    RabbitMqContext,
    RedisContext,
    WorldContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: {
      maxParamLength: 255,
    },
  },
  mongodb: env.MONGODB_URL,
  providers: [
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
  ],
};
