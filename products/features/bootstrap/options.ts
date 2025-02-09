import { Type } from '@nestjs/common';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  GraphQLContext,
  HttpContext,
  HttpProvider,
  InMemoryReplSetProvider,
  LoggerContext,
  PersistentProvider,
  ProviderInterface,
  RabbitMqContext,
  RabbitMqRpcContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import * as qs from 'qs';

import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppConfigurator } from './app.configurator';
import { environment } from '../../src/environments';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { MutexProvider } from '@pe/cucumber-sdk/module/mutex';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;
environment.microUrlMedia = 'http://media-micro.url';
environment.test = true; // for cucumber test

const dbProvider: Type<ProviderInterface> =
  process.env.E2E_DatabaseProvider === 'PersistentProvider' ? PersistentProvider : InMemoryReplSetProvider;
export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator as any,
  contexts: [
    AuthContext,
    DatabaseContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqRpcContext,
    RabbitMqContext,
    GraphQLContext,
    LoggerContext,
    ElasticsearchContext,
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
    ElasticSearchProvider,
    dbProvider,
    HttpProvider,
    RedisProvider,
    MutexProvider,
    RabbitMqProvider,
  ],
};
