import * as path from 'path';

import * as dotenv from 'dotenv';
import * as qs from 'qs';

import {
  AuthContext,
  CucumberOptionsInterface,
  DatabaseContext,
  HttpContext,
  HttpProvider,
  InMemoryProvider,
  LoggerContext,
  RabbitMqContext,
  RabbitMqRpcContext,
  WorldContext,
} from '@pe/cucumber-sdk/module/';
import { RabbitMqProvider } from '@pe/cucumber-sdk/module/rabbit';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ElasticsearchContext } from '@pe/cucumber-sdk/module/contexts/elasticsearch.context';
import { ElasticSearchProvider } from '@pe/cucumber-sdk/module/elasticsearch/elastic-search.provider';

import { AppConfigurator } from './app.configurator';
import { RedisProvider } from "@pe/cucumber-sdk/module/redis";

dotenv.config({ });
const env: NodeJS.ProcessEnv = process.env;

export const options: CucumberOptionsInterface = {
    appConfigurator: AppConfigurator,
    contexts: [
      AuthContext,
      DatabaseContext,
      WorldContext,
      HttpContext,
      RabbitMqContext,
      LoggerContext,
      ElasticsearchContext,
      RabbitMqRpcContext,
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
      HttpProvider,
      InMemoryProvider,
      RabbitMqProvider,
      ElasticSearchProvider,
      RedisProvider,
    ],
};
