import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum } from '../user/enums';
import { Error } from 'mongoose';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;
const isNumeric: (n: any) => boolean = (n: any): boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

export const environment: any = {
  adminEmail: env.ADMIN_EMAIL,
  adminEmailCC: env.ADMIN_EMAIL_CC?.split(' '),
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      centralConfig: env.ELASTIC_APM_CENTRAL_CONFIG,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      secretToken: env.ELASTIC_APM_SECRET_TOKEN,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
      skipExceptions: [Error.ValidationError],
    },
  },

  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  authUrl: env.MICRO_URL_AUTH_INTERNAL,
  businessExportReportEmailCc: env.BUSINESS_EXPORT_REPORT_EMAIL_CC,
  businessExportReportEmailTo: env.BUSINESS_EXPORT_REPORT_EMAIL_TO,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,

  commerceOsUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
  mongodb: env.MONGODB_URL,

  microStorageUrl: env.MICRO_URL_CUSTOM_STORAGE ?
      env.MICRO_URL_CUSTOM_STORAGE : 'https://payevertesting.blob.core.windows.net',

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (
        isNumeric(env.JWT_EXPIRES_IN)
          ? parseInt(env.JWT_EXPIRES_IN, 10)
          : env.JWT_EXPIRES_IN
      ),
    },
  },

  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },

  rabbitChannelFolder: `async_events_${env.QUEUE_NAME}_micro`,
  rabbitChannelFolderExport: `async_events_${env.QUEUE_NAME}_micro`,
  rabbitExchangeFolder: `${env.QUEUE_NAME}`,
  rabbitExchangeFolderExport: `${env.QUEUE_NAME}`,
  rabbitmq: {
    expireInMS: 10000,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    shouldLogEvents: (env.RABBITMQ_SHOULD_LOG_EVENTS ?? 'true') === 'true',
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    isGlobalPrefetchCount: false,
    prefetchCount: 10,
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },

    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: MessageBusChannelsEnum.users,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.users,
              durable: true,
            },
          },
        ],
      },
    ],
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  redis: {
    clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: +process.env.REDIS_PORT,    
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },

  secretsEncryptionIv: env.SECRETS_ENCRYPTION_IV,
  secretsEncryptionKey: env.SECRETS_ENCRYPTION_KEY,
};
