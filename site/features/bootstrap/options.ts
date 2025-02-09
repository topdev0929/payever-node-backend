import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  GraphQLContext,
  HttpContext,
  HttpProvider,
  LoggerContext,
  InMemoryProvider,
  RabbitMqContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis/redis.provider';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { environment } from '../../src/environments';
import { AppConfigurator } from './app.configurator';
import { IngressClientProvider } from '../mocks/ingress-client/ingress-client.provider';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;
environment.microUrlMedia = 'http://media-micro.url';
env.BUILDER_SITE_DOMAINS = 'DOMAIN.test.devpayever.site';

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
    GraphQLContext,
    LoggerContext,
    ElasticsearchContext,
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
    RabbitMqProvider,
    ElasticSearchProvider,
    RedisProvider,
    IngressClientProvider,
  ],
};
