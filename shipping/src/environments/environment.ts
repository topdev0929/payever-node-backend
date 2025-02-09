import * as dotenv from 'dotenv';
import * as path from 'path';

import { RabbitChannelsEnum, RabbitExchangesEnum  } from './rabbitmq';

dotenv.config();
const env: any = process.env;

const isNumeric: any = (n: any): boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
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
            name: RabbitChannelsEnum.Shipping,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Shipping,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.shippingFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.ShippingFolders,
            options: {
              deadLetterExchange: 'shipping_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.ShippingFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.shippingFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.ShippingFoldersExport,
            options: {
              deadLetterExchange: 'shipping_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.ShippingFoldersExport,
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
    clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT, 10),
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN) ?
    parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10) : env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
  synchronizationCron: env.SYNCHRONIZATION_CRON || '* * * * *',
  thirdPartyMicroUrl: env.MICRO_URL_THIRD_PARTY,
  thirdPartyShippingMicroUrl: env.MICRO_URL_THIRD_PARTY_SHIPPING_INTERNAL,
  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_SHIPPING_INTERNAL,
  },
};
