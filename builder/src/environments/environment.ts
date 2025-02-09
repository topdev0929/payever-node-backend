import * as dotenv from 'dotenv';
import * as path from 'path';
import { ApplicationTypesEnum } from '@pe/builder-kit/module/common/enums';
import { GeneralConfig } from './config';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

type IsNumericType = (n: any) => boolean;
const isNumeric: IsNumericType = (n: any) : boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

const applicationType: () => ApplicationTypesEnum = () : ApplicationTypesEnum => {
  if (!env.APPLICATION_TYPE) {
    throw new Error(`Environment variable "APPLICATION_TYPE" is not set`);
  }
  const type: string = env.APPLICATION_TYPE.toLowerCase();
  switch (type) {
    case 'affiliates' :
    case 'affiliate' :
      return ApplicationTypesEnum.Affiliate;
    case 'appointments' :
    case 'appointment' :
      return ApplicationTypesEnum.Appointments;
    case 'shops' :
    case 'shop' :
      return ApplicationTypesEnum.Shop;
    case 'blogs' :
    case 'blog' :
      return ApplicationTypesEnum.Blog;
    case 'studios' :
    case 'studio' :
      return ApplicationTypesEnum.Studio;
    case 'message' :
      return ApplicationTypesEnum.Message;
    case 'sites' :
    case 'site' :
      return ApplicationTypesEnum.Site;
    case 'invoices' :
    case 'invoice' :
      return ApplicationTypesEnum.Invoice;
    case 'subscriptions' :
    case 'subscription' :
      return ApplicationTypesEnum.Subscriptions;
    case 'mail' :
      return ApplicationTypesEnum.Mail;
    case 'application' : // for test
      return 'shop' as any;
    default:
      throw new Error(`Environment variable "APPLICATION_TYPE" is not set`);
  }
};

const wsUrl: () => string = () : string => {
  if (!process.env.MICRO_WS_BUILDER_INTERNAL) {
    return '';
  }
  const type: ApplicationTypesEnum = applicationType();
  if (GeneralConfig.wsDisabled.includes(type)) {
    return ;
  }

  switch (true) {
    case type === ApplicationTypesEnum.Shop:
      return process.env.MICRO_WS_BUILDER_SHOPS_INTERNAL;
    case type === ApplicationTypesEnum.Site:
      return process.env.MICRO_WS_BUILDER_SITE_INTERNAL;
    case type === ApplicationTypesEnum.Message:
      return process.env.MICRO_WS_BUILDER_MESSAGE_INTERNAL;
    case type === ApplicationTypesEnum.Subscriptions:
      return process.env.MICRO_WS_BUILDER_SUBSCRIPTION_INTERNAL;
    case type === ApplicationTypesEnum.Invoice:
      return process.env.MICRO_WS_BUILDER_INVOICE_INTERNAL;
    case type === ApplicationTypesEnum.Affiliate:
      return process.env.MICRO_WS_BUILDER_AFFILIATE_INTERNAL;
    case type === ApplicationTypesEnum.Blog:
      return process.env.MICRO_WS_BUILDER_BLOG_INTERNAL;
    case type === ApplicationTypesEnum.Mail:
      return process.env.MICRO_WS_BUILDER_MAIL_INTERNAL;
  }

  return process.env.MICRO_WS_BUILDER_INTERNAL;
};

export const environment: any = {
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
    },
  },
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  applicationType: applicationType(),
  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST || `http://localhost:9200`,
  },
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN)
        ? parseInt(env.JWT_EXPIRES_IN, 10)
        : env.JWT_EXPIRES_IN,
    },
  },
  microUrlMedia: env.MICRO_URL_MEDIA_INTERNAL,
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitChannel: `async_events_${env.QUEUE_NAME}_micro`,
  rabbitChannelFolder: `async_events_${env.QUEUE_NAME}_folders_micro`,
  rabbitChannelFolderExport: `async_events_${env.QUEUE_NAME}_folders_export_micro`,
  rabbitExchangeFolder: `async_events_${env.QUEUE_NAME}_folders`,
  rabbitExchangeFolderExport: `${env.QUEUE_NAME}_folders_export`,
  rabbitmq: {
    compilationQueuePrefix: env.QUEUE_PREFIX,
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [
          {
            name: `async_events_${env.QUEUE_NAME}_micro`,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: `async_events_${env.QUEUE_NAME}_micro`,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: `async_events_${env.QUEUE_NAME}_folders`,
        options: { durable: true },
        queues: [
          {
            name: `async_events_${env.QUEUE_NAME}_folders_micro`,
            options: {
              deadLetterExchange: `${env.QUEUE_NAME}_folders_fallback`,
              deadLetterRoutingKey: `async_events_${env.QUEUE_NAME}_folders_micro`,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: `${env.QUEUE_NAME}_folders_export`,
        options: { durable: true },
        queues: [
          {
            name: `async_events_${env.QUEUE_NAME}_folders_export_micro`,
            options: {
              deadLetterExchange: `${env.QUEUE_NAME}_folders_export_fallback`,
              deadLetterRoutingKey: `async_events_${env.QUEUE_NAME}_folders_export_micro`,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
    ],
    isGlobalPrefetchCount: false,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    prefetchCount: 1,
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
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,

  generalConfig: GeneralConfig,
  webSocket: {
    port: env.WS_PORT,
  },
  wsUrl: wsUrl(),

  blobStorage: env.MICRO_URL_CUSTOM_STORAGE,
  mediaServiceUrl: env.MICRO_URL_MEDIA_INTERNAL,
};
