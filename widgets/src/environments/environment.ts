import * as dotenv from 'dotenv';
import {
  parseEnvVarAsInt,
} from '@pe/nest-kit';
import * as path from 'path';
import { MessageBusChannelsEnum } from '../common';
import ProcessEnv = NodeJS.ProcessEnv;
import { MongoError } from 'mongodb';

type IsNumericType = (n: any) => boolean;

const isNumeric: IsNumericType = (n: any) : boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

dotenv.config();
const env: ProcessEnv = process.env;

export const environment: any = {
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      centralConfig: env.ELASTIC_APM_CENTRAL_CONFIG,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
      skipExceptions: [MongoError],
    },
  },
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  commerseOSUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
  contactServiceUrl: env.MICRO_URL_CONTACTS_INTERNAL,
  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN) ?
        parseInt(env.JWT_EXPIRES_IN, 10) :
        env.JWT_EXPIRES_IN),
    },
  },
  messageServiceUrl: env.MICRO_URL_MESSAGE_INTERNAL,
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.widgets,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.widgets,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
    ],
    isGlobalPrefetchCount: false,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    prefetchCount: 10,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },
  redis: {
    clusterHosts: env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: (isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN) ?
    parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10) :
    env.JWT_REFRESH_TOKEN_EXPIRES_IN),
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  shippingServiceUrl: env.MICRO_URL_SHIPPING_INTERNAL,
  statusPort: env.STATUS_APP_PORT,
  webSocket: {
    port: env.WS_PORT,
  },
};
