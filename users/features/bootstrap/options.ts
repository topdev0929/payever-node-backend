import { Type } from '@nestjs/common';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryReplSetProvider,
  PersistentProvider,
  ProviderInterface,
  RabbitMqContext,
  RabbitMqRpcContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { CustomStorageContext } from '../contexts/custom-storage.context';
import { AppConfigurator } from './app.configurator';

dotenv.config({});
const env: NodeJS.ProcessEnv = process.env;

const dbProvider: Type<ProviderInterface> = 
  env.E2E_DatabaseProvider === 'PersistentProvider' ? PersistentProvider : InMemoryReplSetProvider;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AuthContext,
    DatabaseContext,
    ElasticsearchContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    CustomStorageContext,
    RabbitMqContext,
    RabbitMqRpcContext,
  ],
  dataPath: path.resolve('./features/data'),
  fixtures: path.resolve('./features/fixtures'),
  httpAdapter: {
    class: FastifyAdapter,
    options: {},
  },
  mongodb: env.MONGODB_URL,
  providers: [
    ElasticSearchProvider,
    dbProvider,
    HttpProvider,
    RabbitMqProvider,
    RedisProvider,
  ],
};
