import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../wallpapers/enum';
import ProcessEnv = NodeJS.ProcessEnv;

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
    },
  },
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  blobStorage: env.MICRO_URL_CUSTOM_STORAGE,
  dropBoxAccessToken: env.DROPBOX_ACCESS_TOKEN,
  elastic: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },
  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: 3600,
    },
  },
  mediaServiceUrl: env.MICRO_URL_MEDIA_INTERNAL,
  microservice: 'settings',
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
            name: RabbitChannelsEnum.Wallpapers,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Wallpapers,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.wallpapersFolders,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.WallpapersFolders,
            options: {
              deadLetterExchange: 'wallpapers_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.WallpapersFolders,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
    ],
    expireInMS: 10000,
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
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,

  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_WALLPAPERS_INTERNAL,
  },
};
