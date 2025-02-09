import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider,
  LoggerContext,
  RedisContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { AppConfigurator } from './app.configurator';
import * as dotenv from 'dotenv';
import * as path from 'path';

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
    RedisProvider,
    RabbitMqProvider,
  ],
};
