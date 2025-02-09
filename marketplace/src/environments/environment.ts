import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../marketplace/enums';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  elastic: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
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
  refreshTokenExpiresIn: (
    isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
      : env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ),
  statusPort: env.STATUS_APP_PORT,

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN))
        ? parseInt(env.JWT_EXPIRES_IN, 10)
        : env.JWT_EXPIRES_IN,
    },
  },
  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.Marketplace,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Marketplace,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.marketplaceFolders,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.MarketplaceFolders,
            options: {
              deadLetterExchange: 'marketplace_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.MarketplaceFolders,
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
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },

  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
    },
  },

  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_MARKETPLACE,
  },
};
