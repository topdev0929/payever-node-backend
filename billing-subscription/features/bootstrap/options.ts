import { FastifyAdapter } from '@nestjs/platform-fastify';
import {
  AuthContext,
  AxiosContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  LoggerContext,
  InMemoryProvider,
  RabbitMqContext,
  StorageContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { RedisProvider } from '@pe/cucumber-sdk/module/redis';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as qs from 'qs';
import { AppConfigurator } from './app.configurator';
import { environment } from '../../src/environments';

dotenv.config({ });
const env: NodeJS.ProcessEnv = process.env;
environment.thirdPartyUrl = 'http://third-party.service';
environment.billingSubscriptionUrl = 'http://billing-subscriptions.service';
environment.payeverCNAME = 'payeverCNAME';
environment.payeverIP = 'payeverIP';

export const options: CucumberOptionsInterface = {
  appConfigurator: AppConfigurator,
  contexts: [
    AuthContext,
    DatabaseContext,
    ElasticsearchContext,
    WorldContext,
    LoggerContext,
    HttpContext,
    StorageContext,
    RabbitMqContext,
    AxiosContext,
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
    HttpProvider,
    InMemoryProvider,
    RabbitMqProvider,
    RedisProvider,
  ],
};
