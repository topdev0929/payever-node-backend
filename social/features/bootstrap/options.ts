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
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as qs from 'qs';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';

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
    ElasticsearchContext,
  ],
  dataPath: path.resolve('./features/data'),
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
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
    ElasticSearchProvider,
  ],
};
