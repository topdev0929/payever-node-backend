import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannels, RabbitExchangesEnum } from '../enums';
import ProcessEnv = NodeJS.ProcessEnv;
import { parseEnvVarAsInt } from '@pe/nest-kit';

dotenv.config();
const env: ProcessEnv = process.env;
const isNumeric: (n: any) => boolean = (n: any): boolean => {
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
  connectMicroUrlBase: env.MICRO_URL_CONNECT,
  defaultCurrency: env.DEFAULT_CURRENCY,
  elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
  elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
  elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
  elasticSearchHost: env.ELASTIC_HOST,
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    jwtKeyExtractorOptions: {
      authScheme: env.JWT_AUTH_SCHEME,
      tokenQueryParameterName: env.JWT_PARAM_NAME,
    },
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (
        isNumeric(env.JWT_EXPIRES_IN)
          ? parseInt(env.JWT_EXPIRES_IN, 10)
          : env.JWT_EXPIRES_IN
      ),
    },
  },
  microUrlMedia: env.MICRO_URL_MEDIA_INTERNAL,
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    dataPayload: env.DATA_PAYLOAD || '{}',
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannels.Transactions,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannels.Transactions,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.transactionsFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannels.TransactionsFolders,
            options: {
              deadLetterExchange: 'transactions_folders_fallback',
              deadLetterRoutingKey: RabbitChannels.TransactionsFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.transactionsFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannels.TransactionsFoldersExport,
            options: {
              deadLetterExchange: 'transactions_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannels.TransactionsFoldersExport,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.transactionsExport,
        options: {
          arguments: {
            'hash-header': 'hash-on',
          },
          durable: true,
        },
        type: 'direct',

        queues: [
          {
            name: RabbitChannels.TransactionsExport,
            options: {
              deadLetterExchange: 'transactions_export_fallback',
              deadLetterRoutingKey: RabbitChannels.TransactionsExport,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.transactionsExportDynamic,
        options: {
          arguments: {
            'hash-header': 'hash-on',
          },
          durable: true,
        },
        queues: [
          {
            consumerDependent: true,
            name: env.RABBIT_TRANSACTIONS_QUEUE_NAME
              ? env.RABBIT_TRANSACTIONS_QUEUE_NAME
              : RabbitChannels.TransactionsExportDynamic,
            options: {
              autoDelete: true,
              durable: true,
            },
          },
        ],
        type: 'x-consistent-hash',
      },
      {
        name: RabbitExchangesEnum.transactionsAnonymize,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannels.TransactionsAnonymize,
            options: {
              deadLetterExchange: 'transactions_anonymize_fallback',
              deadLetterRoutingKey: RabbitChannels.TransactionsAnonymize,
              durable: true,
            },
          },
        ],
      },
    ],
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    isGlobalPrefetchCount: false,
    prefetchCount: 1,
    rabbitExportId: env.RABBIT_EXPORT_ID || '',
    rabbitTransactionsQueueName: env.RABBIT_TRANSACTIONS_QUEUE_NAME || '',
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    userId: env.userId || '',
  },
  redis: {
    clusterHosts: env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseEnvVarAsInt(env.REDIS_CONNECT_TIMEOUT),
    password: env.REDIS_PASSWORD,
    port: env.REDIS_PORT,
    retryAttempts: parseEnvVarAsInt(env.REDIS_RETRY_ATTEMPTS),
    retryDelay: parseEnvVarAsInt(env.REDIS_RETRY_DELAY),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: (
    isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
      : env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ),
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
  stub: env.STUB === 'true',
  thirdPartyPaymentsMicroUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS_INTERNAL,
  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_TRANSACTIONS,
  },

  exportTransactionsCountDirectLimitAdmin: env.EXPORT_TRANSACTIONS_COUNT_DIRECT_LIMIT_ADMIN ?
    env.EXPORT_TRANSACTIONS_COUNT_DIRECT_LIMIT_ADMIN : 10000,
  exportTransactionsCountDirectLimitMerchant: env.EXPORT_TRANSACTIONS_COUNT_DIRECT_LIMIT_MERCHANT ?
    env.EXPORT_TRANSACTIONS_COUNT_DIRECT_LIMIT_MERCHANT : 2000,
  exportTransactionsCountPdfLimit: env.EXPORT_TRANSACTIONS_COUNT_PDF_LIMIT ?
    env.EXPORT_TRANSACTIONS_COUNT_PDF_LIMIT : 10000,
  exportTransactionsCountTotalLimit: env.EXPORT_TRANSACTIONS_COUNT_TOTAL_LIMIT ?
    env.EXPORT_TRANSACTIONS_COUNT_TOTAL_LIMIT : 10000,
  exportTransactionsDocExpiry: env.EXPORT_TRANSACTIONS_DOC_EXPIRY || 24 * 60 * 60,
};
