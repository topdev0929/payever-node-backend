import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  GraphQLContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider,
  RabbitMqContext,
  StorageContext,
} from '@pe/cucumber-sdk/module/';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as path from 'path';
import { AppConfigurator } from './app.configurator';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as qs from 'qs';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';


const env: NodeJS.ProcessEnv = process.env;
env.POD = null;

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    GraphQLContext,
    AxiosContext,
    HttpContext,
    DatabaseContext,
    StorageContext,
    AuthContext,
    RabbitMqContext,
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
    InMemoryProvider,
    HttpProvider,
    RedisProvider,
    RabbitMqProvider,
    ElasticSearchProvider,
  ],
};
