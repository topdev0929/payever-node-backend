import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../affiliates/enums';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  encryptionOptions: {
    masterKey: env.ENCRYPTION_MASTER_KEY || 'master-key',
    salt: env.AFFILIATE_ENCRYPTION_SALT || 'salt',
  },
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,

  microservice: 'affiliates',
  mongodb: env.MONGODB_URL,

  elastic: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },

  redis: {
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: (
    isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
      : env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ),

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
  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.Affiliates,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Affiliates,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.affiliatesFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.AffiliatesFolders,
            options: {
              deadLetterExchange: 'affiliates_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.AffiliatesFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.affiliatesFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.AffiliatesFoldersExport,
            options: {
              deadLetterExchange: 'affiliates_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.AffiliatesFoldersExport,
              durable: true,
            },
          },
        ],
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

  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_AFFILIATES,
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
};
