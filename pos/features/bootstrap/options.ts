import * as dotenv from 'dotenv';
import * as path from 'path';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as qs from 'qs';

import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider,
  RabbitMqContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import { AppConfigurator } from './app.configurator';

dotenv.config({});
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
  contexts: [
    AuthContext,
    DatabaseContext,
    ElasticsearchContext,
    HttpContext,
    StorageContext,
    RabbitMqContext,
    AxiosContext,
    WorldContext,
  ],
  fixtures: path.resolve('./features/fixtures'),
  appConfigurator: AppConfigurator,
  httpAdapter: {
    class: FastifyAdapter,
    options: {
      maxParamLength: 255,
      querystringParser: (str: string): any => qs.parse(str),
    },
  },
  providers: [
    InMemoryProvider,
    ElasticSearchProvider,
    RabbitMqProvider,
    RedisProvider,
    HttpProvider,
  ],
  mongodb: `${env.MONGODB_URL}`,
};
