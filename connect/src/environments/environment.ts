import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;
import { RabbitChannelEnum, RabbitExchangesEnum } from './rabbit.enum';

dotenv.config();
const env: ProcessEnv = process.env;

type IsNumericType = (n: any) => boolean;
const isNumeric: IsNumericType = (n: any) : boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

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
  connectBackendAPIUrlPrefix: env.MICRO_URL_CONNECT,
  debitoorBackendAPIUrlPrefx: env.MICRO_URL_DEBITOOR,
  dhlBackendAPIUrlPrefix: env.MICRO_URL_DHL,

  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },

  jwtOptions: {
    jwtKeyExtractorOptions: {
      authScheme: env.JWT_AUTH_SCHEME,
      tokenBodyField: env.JWT_PARAM_NAME,
      tokenQueryParameterName: env.JWT_PARAM_NAME,
    },
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN)
        ? parseInt(env.JWT_EXPIRES_IN, 10)
        : env.JWT_EXPIRES_IN,
    },
  },

  mongodb: env.MONGODB_URL,
  mongodbUsers: env.MONGODB_URL_USERS,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',

  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelEnum.connect,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelEnum.connect,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.connectFolders,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelEnum.connectFolders,
            options: {
              deadLetterExchange: 'connect_folders_fallback',
              deadLetterRoutingKey: RabbitChannelEnum.connectFolders,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.connectFoldersExport,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelEnum.connectFoldersExport,
            options: {
              deadLetterExchange: 'connect_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelEnum.connectFoldersExport,
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

  santanderContractUploadEmail: env.SANTANDER_INSTALLMENT_CONTRACT_FILES_EMAIL,
  santanderDKemail: env.SANTANDER_DENMARK_ONBOARDING_BANK_EMAIL,
  santanderSEemail: env.SANTANDER_SWEDEN_ONBOARDING_BANK_EMAIL,
  statusPort: env.STATUS_APP_PORT,
  storage_url: env.MICRO_URL_CUSTOM_STORAGE,
  thirdPartyCommunicationsUrl: env.MICRO_URL_THIRD_PARTY_COMMUNICATIONS,
  thirdPartyMessengerUrl: env.MICRO_URL_THIRD_PARTY_MESSENGER,
  thirdPartyPaymentsUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS,
  thirdPartyProductsUrl: env.MICRO_URL_THIRD_PARTY_PRODUCTS,
  thirdPartyShippingUrl: env.MICRO_URL_THIRD_PARTY_SHIPPING,
  twillioBackendAPIUrlPrefix: env.MICRO_URL_TWILIO,
  usersBackendAPIUrlPrefix: env.MICRO_URL_USERS_INTERNAL,

  microUrlCustomCdn: env.MICRO_URL_CUSTOM_CDN,
  microUrlMedia: env.MICRO_URL_MEDIA_INTERNAL,

  microUrlTranslationStorage: env.MICRO_URL_TRANSLATION_STORAGE || 'https://payevertesting.azureedge.net',
};
