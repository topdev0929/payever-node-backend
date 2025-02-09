import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  LoggerContext,
  RabbitMqContext,
  StorageContext,
  InMemoryProvider,
  WorldContext,
} from '@pe/cucumber-sdk';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis'
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as qs from 'qs';
import { environment } from '../../src/environments';
import { AppConfigurator } from './app.configurator';
import { IngressClientProvider } from '../mocks/ingress-client/ingress-client.provider';
import { IngressClientContext } from '../steps/ingress-client.context';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;
env.BUILDER_BLOG_DOMAINS = 'DOMAIN.test.devpayever.blog';

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
    LoggerContext,
    ElasticsearchContext,
    IngressClientContext,
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
    RedisProvider,
    HttpProvider,
    RabbitMqProvider,
    ElasticSearchProvider,
    IngressClientProvider,
    InMemoryProvider,
  ],
};
