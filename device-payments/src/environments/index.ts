import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum } from '../enum';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

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
  checkoutWrapper: env.MICRO_URL_FRONTEND_CHECKOUT_WRAPPER,
  jwtOptions: {
    jwtKeyExtractorOptions: {
      tokenBodyField: 'token',
      tokenQueryParameterName: 'token',
    },
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
  },
  mediaUrl: env.MICRO_URL_MEDIA,
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: MessageBusChannelsEnum.devicePayments,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.devicePayments,
              durable: true,
            },
          },
        ],
      },
    ],
    isGlobalPrefetchCount: false,
    prefetchCount: 10,
    rsa: {
      private: env.RABBITMQ_CERTIFICATE_PATH && path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
  },
  redis: {
    clusterHosts: env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusAppPort: env.STATUS_APP_PORT,
  thirdPartyCommunicationsUrl: env.MICRO_URL_THIRD_PARTY_COMMUNICATIONS,
  thirdPartyUrl: env.MICRO_URL_THIRD_PARTY,
  transactionsUrl: env.MICRO_URL_TRANSACTIONS,
};
