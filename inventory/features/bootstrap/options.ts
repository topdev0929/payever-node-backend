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
  RedisContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppConfigurator } from './app.configurator';

dotenv.config({
  path: path.resolve('./features/app/.env'),
});
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator as any,
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqContext,
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
    InMemoryProvider,
    HttpProvider,
    RedisProvider,
    RabbitMqProvider,
  ],
};
