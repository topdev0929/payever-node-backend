import * as dotenv from 'dotenv';
import * as path from 'path';

import { MessageBusChannelsEnum } from '../common';
import { shippingServiceEndpointsConfig } from './shipping-service-endpoints.config';

import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean =>
  !isNaN(parseInt(n, 10)) && isFinite(n);

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  production: env.PRODUCTION_MODE === 'true',

  applicationName: env.APP_NAME,
  port: env.APP_PORT,
  statusPort: env.STATUS_APP_PORT,

  mongodb: env.MONGODB_URL,

  devicePaymentsUrl: env.MICRO_URL_DEVICE_PAYMENTS_INTERNAL,
  paymentsAPIUrl: env.MICRO_URL_PHP_CHECKOUT_INTERNAL,
  productsUrl: env.MICRO_URL_PRODUCTS,
  shippingUrl: env.MICRO_URL_SHIPPING_INTERNAL,
  transactionsUrl: env.MICRO_URL_TRANSACTIONS_INTERNAL,

  shippingServiceEndpoints: shippingServiceEndpointsConfig,

  debitoorBackendAPIUrlPrefx: env.MICRO_URL_CONNECT_DEBITOOR,
  dhlBackendAPIUrlPrefix: env.MICRO_URL_CONNECT_DHL,
  twillioBackendAPIUrlPrefix: env.MICRO_URL_CONNECT_TWILIO,

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
        name: 'async_events',
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: MessageBusChannelsEnum.thirdParty,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.thirdParty,
              durable: true,
            },
          },
        ],
      },
    ],
  },

  rsa: env.RABBITMQ_CERTIFICATE_PATH
    ? { private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH) }
    : undefined,

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
};

export function getServiceUrl(identifier: string): string {
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}
