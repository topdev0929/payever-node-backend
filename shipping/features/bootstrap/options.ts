import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  GraphQLContext,
  HttpContext,
  RabbitMqContext,
  StorageContext,
  WorldContext,
  HttpProvider,
  InMemoryProvider,
} from '@pe/cucumber-sdk';
import * as qs from 'qs';

import { FastifyAdapter } from '@nestjs/platform-fastify';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { AppConfigurator } from './app.configurator';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { environment } from '../../src/environments';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;
environment.thirdPartyMicroUrl = 'http://third-party.test';

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator as any,
  contexts: [
    AuthContext,
    DatabaseContext,
    ElasticsearchContext,
    WorldContext,
    HttpContext,
    AxiosContext,
    StorageContext,
    RabbitMqContext,
    GraphQLContext,
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
  providers: [ElasticSearchProvider, InMemoryProvider, HttpProvider, RabbitMqProvider, RedisProvider],
};
