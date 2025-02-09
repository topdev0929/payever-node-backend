import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider, LoggerContext,
  RabbitMqContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { MailerContext } from '../step_definitions/mailer.context';
import { MailerStub } from '../step_definitions/mailer.stub';
import { AppConfigurator } from './app.configurator';

dotenv.config({ });
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
    AxiosContext,
    MailerContext,
    LoggerContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  mongodb: env.MONGODB_URL,
  httpAdapter: {
    class: FastifyAdapter,
    options: { },
  },
  providers: [HttpProvider, InMemoryProvider, RabbitMqProvider, RedisProvider, MailerStub],
};
