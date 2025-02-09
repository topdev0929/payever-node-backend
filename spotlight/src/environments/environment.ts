// tslint:disable object-literal-sort-keys
import * as dotenv from 'dotenv';
import * as path from 'path';

import { RabbitChannelsEnum } from './rabbitmq.enum';

import {
  parseEnvVarAsBoolean,
  parseEnvVarAsInt,
  parsePlainEnv,
} from '@pe/nest-kit';

import { AppConfigDtoLocal } from './environment.dto';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: AppConfigDtoLocal = parsePlainEnv({
  appCors: false,
  production: parseEnvVarAsBoolean(env.PRODUCTION_MODE),

  applicationName: env.APP_NAME,
  port: parseEnvVarAsInt(env.APP_PORT),
  statusPort: parseEnvVarAsInt(env.STATUS_APP_PORT),

  mongodb: env.MONGODB_URL,

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
  },

  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  redis: {
    clusterHosts: env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseEnvVarAsInt(env.REDIS_CONNECT_TIMEOUT),
    password: env.REDIS_PASSWORD,
    port: parseEnvVarAsInt(env.REDIS_PORT),
    retryAttempts: parseEnvVarAsInt(env.REDIS_RETRY_ATTEMPTS),
    retryDelay: parseEnvVarAsInt(env.REDIS_RETRY_DELAY),
    url: env.REDIS_URL,
  },

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: parseEnvVarAsInt(env.JWT_EXPIRES_IN),
    },
  },

  refreshTokenExpiresIn: -1,
  apm: {
    enable: false,
    options: null,
  },

  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    exchanges: [{
      name: 'async_events',
      options: { durable: true },
      queues: [{
        name: RabbitChannelsEnum.Spotlight,
        options: {
          deadLetterExchange: 'async_events_fallback',
          deadLetterRoutingKey: RabbitChannelsEnum.Spotlight,
          durable: true,
        },
      }],
      type: 'direct',
    }],

    isGlobalPrefetchCount: false,
    prefetchCount: 10,
  },

  pact: parseEnvVarAsBoolean(env.PACT),
}, AppConfigDtoLocal);
