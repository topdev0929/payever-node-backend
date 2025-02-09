import * as path from 'path';

import * as dotenv from 'dotenv';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../coupons/enum';

const isNumeric: (n: any) => boolean = (n: any): boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

const toInt: (n: any) => number = (n: any): number => Number.parseInt(n, 10) || 0;

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

// tslint:disable-next-line: typedef
export const environment: any = {
  appNamespace: env.APP_NAMESPACE,
  applicationName: env.APP_NAME,
  authMicroBaseUrl: env.MICRO_URL_AUTH_INTERNAL,
  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },
  mongodb: env.MONGODB_URL,
  port: toInt(env.APP_PORT),
  production: env.PRODUCTION_MODE === 'true',

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN) as number,
    },
  },
  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.Coupons,
          options: {
            deadLetterExchange: 'async_events_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.Coupons,
            durable: true,
          },
        }],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.couponsFolders,
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.CouponsFolders,
          options: {
            deadLetterExchange: 'coupons_folders_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.CouponsFolders,
            durable: true,
          },
        }],
        type: 'direct',
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
  statusPort: toInt(env.STATUS_APP_PORT),

};
