import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../common';

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
  blobStorage: env.MICRO_URL_CUSTOM_STORAGE,
  commerseOSUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
  contactServiceUrl: env.MICRO_URL_CONTACTS,
  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },
  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN) ?
        parseInt(env.JWT_EXPIRES_IN, 10) :
        env.JWT_EXPIRES_IN),
    },
  },
  mediaServiceUrl: env.MICRO_URL_MEDIA,
  messageServiceUrl: env.MICRO_URL_MESSAGE,
  microUrlCustomCdn: env.MICRO_URL_CUSTOM_CDN,
  microservice: 'social',
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.Social,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Social,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.socialFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.SocialFolders,
            options: {
              deadLetterExchange: 'social_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.SocialFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.socialFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.SocialFoldersExport,
            options: {
              deadLetterExchange: 'social_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.SocialFoldersExport,
              durable: true,
            },
          },
        ],
      },
    ],
    isGlobalPrefetchCount: false,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    prefetchCount: 10,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },
  redis: {
    clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT, 10),
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
  shippingServiceUrl: env.MICRO_URL_SHIPPING,
  statusPort: env.STATUS_APP_PORT,
  thirdpartyUrl: env.MICRO_URL_THIRD_PARTY_SOCIAL_INTERNAL,
  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_SOCIAL,
  },
};
