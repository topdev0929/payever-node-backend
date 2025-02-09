import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum } from './rabbitmq.enum';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

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
  authMicroBaseUrl: env.MICRO_URL_AUTH,
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
    expireInMS: 10000,
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
            name: MessageBusChannelsEnum.commerceos,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.commerceos,
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
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  rsa: {
    private: env.RABBITMQ_CERTIFICATE_PATH && path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,

  microUrlAuth: env.MICRO_URL_AUTH,
  microUrlCheckout: env.MICRO_URL_CHECKOUT + '/api',
  microUrlCommerceOS: env.MICRO_URL_COMMERCEOS + '/api',
  microUrlConnect: env.MICRO_URL_CONNECT + '/api',
  microUrlPlugins: env.MICRO_URL_PLUGINS + '/api',
  microUrlThirdPartyProducts: env.MICRO_URL_THIRD_PARTY_PRODUCTS + '/api',
  microUrlThirdPartyProductsInternal: env.MICRO_URL_THIRD_PARTY_PRODUCTS_INTERNAL + '/api',
  microUrlUser: env.MICRO_URL_USER + '/api',
  microUrlWallpapers: env.MICRO_URL_WALLPAPERS + '/api',
  partnerCacheCalculationsTTL: 24 * 60 * 60,

  microUrlCustomCdn: env.MICRO_URL_CUSTOM_CDN,
};
