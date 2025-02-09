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
  RedisContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppConfigurator } from './app.configurator';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';

dotenv.config({ });
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
    AxiosContext,
    RedisContext,
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
