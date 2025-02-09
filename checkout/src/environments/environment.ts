import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;
import { MongoError } from 'mongodb';
import { MessageBusChannelsEnum, RabbitExchangesEnum } from './rabbit-binding.enum';

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n);

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  applicationType: env.CHECKOUT_APPLICATION_TYPE?.toLowerCase(),
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,

  mongodb: env.MONGODB_URL,

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
  },

  authMicroBaseUrl: env.MICRO_URL_AUTH_INTERNAL,
  checkoutMicroUrl: env.MICRO_URL_CHECKOUT + '/api',
  checkoutPHPMicroUrl: env.MICRO_URL_PHP_CHECKOUT,
  finexpMicroUrl: env.MICRO_URL_FINANCE_EXPRESS,
  frontendCheckoutWrapperMicroUrl: env.MICRO_URL_FRONTEND_CHECKOUT_WRAPPER,
  thirdPartyCommunicationsMicroUrl: env.MICRO_URL_THIRD_PARTY_COMMUNICATIONS_INTERNAL + '/api',
  thirdPartyMicroUrl: env.MICRO_URL_THIRD_PARTY + '/api',
  thirdPartyPaymentsMicroUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS_INTERNAL + '/api',
  transactionsMicroUrl: env.MICRO_URL_TRANSACTIONS_INTERNAL + '/api',

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
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,

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
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },
  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    isGlobalPrefetchCount: false,
    prefetchCount: 10,
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },

    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: MessageBusChannelsEnum.checkout,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.checkout,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.checkoutFolders,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.checkoutFolders,
            options: {
              deadLetterExchange: 'checkout_folders_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.checkoutFolders,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.checkoutFoldersExport,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.checkoutFoldersExport,
            options: {
              deadLetterExchange: 'checkout_folders_export_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.checkoutFoldersExport,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
    ],
  },

  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

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
  supportedLanguages: ['no', 'sv', 'de', 'en', 'es', 'da', 'nl'],
  trustedProxies: env.TRUSTED_PROXIES,

  googleMapsApiKey: env.GOOGLE_MAPS_API_KEY,

  microUrlTranslationStorage: env.MICRO_URL_TRANSLATION_STORAGE,
};
