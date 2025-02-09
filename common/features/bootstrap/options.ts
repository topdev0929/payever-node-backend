import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  RabbitMqContext,
  StorageContext,
  WorldContext,
  InMemoryProvider,
  HttpProvider,
} from '@pe/cucumber-sdk';

import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { AppConfigurator } from './app.configurator';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';

dotenv.config({});
const env = process.env;

export const options: CucumberOptionsInterface = {
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  appConfigurator: AppConfigurator,
  mongodb: env.MONGODB_URL,
  httpAdapter: {
    class: FastifyAdapter,
    options: { },
  },
  providers: [InMemoryProvider, HttpProvider, RabbitMqProvider, RedisProvider],
};
