import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum, RabbitChannelsEnum, RabbitExchangesEnum } from './rabbitmq';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n);

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,

  volumeReportEmailCc: env.VOLUME_REPORT_EMAIL_CC,
  volumeReportEmailTo: env.VOLUME_REPORT_EMAIL_TO,

  microservice: 'statistics',
  mongodb: env.MONGODB_URL,

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
  },

  redis: {
    connect_timeout: env.REDIS_CONNECT_TIMEOUT,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    retryAttempts: env.REDIS_RETRY_ATTEMPTS,
    retryDelay: env.REDIS_RETRY_DELAY,
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
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.statistics,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.statistics,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.statisticsFolders,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.statisticsFolders,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.statisticsFolders,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.statisticsFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.StatisticsFoldersExport,
            options: {
              deadLetterExchange: 'statistics_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.StatisticsFoldersExport,
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
      private: env.RABBITMQ_CERTIFICATE_PATH && path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  telegramAccessToken: env.TELEGRAM_AUTH_KEY,
  telegramChatMissingTransactionsAlerts: env.TELEGRAM_MISSING_TRANSACTIONS_CHAT,

  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
    },
  },
  trustedProxies: env.TRUSTED_PROXIES,
  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_STATISTICS,
  },

  cubejs: {
    apiSecret: env.CUBEJS_API_SECRET,
    dbHost: env.CUBEJS_DB_HOST,
    dbName: env.CUBEJS_DB_NAME,
    dbPass: env.CUBEJS_DB_PASS,
    dbPort: env.CUBEJS_DB_PORT,
    dbType: env.CUBEJS_DB_TYPE,
    dbUser: env.CUBEJS_DB_USER,
    host: env.CUBEJS_HOST,
    port: env.CUBEJS_PORT,
  },
};
