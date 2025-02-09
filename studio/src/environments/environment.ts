import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum, RabbitExchangesEnum, RabbitExchangesFallbackEnum } from '../studio/enums';

dotenv.config();
const env: any = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  apiUrl: env.MICRO_URL_STUDIO,
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  bigFileSize: env.BIG_FILE_SIZE ? env.BIG_FILE_SIZE : 1048576000,
  blobStorage: env.MICRO_URL_CUSTOM_STORAGE,
  cronTimer: {
    every5minutes: `*/5 * * * *`,
    everyMidnight: `0 0 * * *`,
    imageAssessment: env.IMAGE_ASSESSMENT_CRON_TIMER ? env.IMAGE_ASSESSMENT_CRON_TIMER : `* * * * *`,
    mediaInfo: env.MEDIA_INFO_CRON_TIMER ? env.MEDIA_INFO_CRON_TIMER : `* * * * *`,
    videoGenerator: env.VIDEO_GENERATOR_CRON_TIMER ? env.VIDEO_GENERATOR_CRON_TIMER : `* * * * *`,
  },
  dropboxAccessToken: env.DROPBOX_ACCESS_TOKEN,

  elastic: {
    elasticSearch: env.ELASTIC_HOST,
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
  },

  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    jwtKeyExtractorOptions: {
      authScheme: env.JWT_AUTH_SCHEME,
      tokenBodyField: env.JWT_PARAM_NAME,
      tokenQueryParameterName: env.JWT_PARAM_NAME,
    },
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN)
          ? parseInt(env.JWT_EXPIRES_IN, 10)
          : env.JWT_EXPIRES_IN
      ),
    },
  },
  maxTaskTries: env.MAX_TASK_TRIES ? env.MAX_TASK_TRIES : 5,
  mediaServiceUrl: env.MICRO_URL_MEDIA_INTERNAL,
  mongodb: env.MONGODB_URL,
  nimaAssessmentHost: env.NIMA_ASSESSMENT_HOST,
  port: env.APP_PORT,
  processingMaxHours: env.PROCESSING_MAX_HOURS ? env.PROCESSING_MAX_HOURS : 3 ,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.Studio,
            options: {
              deadLetterExchange: RabbitExchangesFallbackEnum.asyncEvents,
              deadLetterRoutingKey: RabbitChannelsEnum.Studio,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.studioFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.StudioFolders,
            options: {
              deadLetterExchange: RabbitExchangesFallbackEnum.studioFolders,
              deadLetterRoutingKey: RabbitChannelsEnum.StudioFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.studioExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.StudioExport,
            options: {
              deadLetterExchange: RabbitExchangesFallbackEnum.studioExport,
              deadLetterRoutingKey: RabbitChannelsEnum.StudioExport,
              durable: true,
            },
          },
        ],
      },
    ],
    isGlobalPrefetchCount: false,
    prefetchCount: 1,
    rsa: {
      private: env.RABBITMQ_CERTIFICATE_PATH && path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
  },
  redis: {
    clusterHosts: (process.env.REDIS_CLUSTER_HOSTS || '').split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT, 10),
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  statusPort: env.STATUS_APP_PORT,

  webSocket: {
    port: env.WS_PORT,
  },
};
