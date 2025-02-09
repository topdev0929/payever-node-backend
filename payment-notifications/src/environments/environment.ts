import * as dotenv from 'dotenv';
import ProcessEnv = NodeJS.ProcessEnv;
import { MessageBusChannelsEnum, MessageBusExchangesEnum } from '../payment-notifications/enums';

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
  authMicroUrl: env.MICRO_URL_AUTH_INTERNAL,
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (
        isNumeric(env.JWT_EXPIRES_IN)
          ? parseInt(env.JWT_EXPIRES_IN, 10)
          : env.JWT_EXPIRES_IN
      ),
    },
  },
  mongodb: env.MONGODB_URL,
  notificationMaxAttempts: env.PAYMENT_NOTIFICATION_MAX_ATTEMPTS ? env.PAYMENT_NOTIFICATION_MAX_ATTEMPTS : 2,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    exchanges: [
      {
        name: MessageBusExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.paymentNotifications,
            options: {
              deadLetterExchange: MessageBusExchangesEnum.asyncEvents + '_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.paymentNotifications,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: MessageBusExchangesEnum.paymentNotificationsSend,
        options: {
          arguments: {
            'hash-header': 'hash-on',
          },
          durable: true,
        },
        queues: [
          {
            consumerDependent: true,
            name: env.RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME
              ? env.RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME
              : MessageBusChannelsEnum.paymentNotificationsSend,
            options: {
              autoDelete: true,
              durable: true,
            },
          },
        ],
        type: 'x-consistent-hash',
      },
    ],
    isGlobalPrefetchCount: false,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    prefetchCount: 1,
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
  refreshTokenExpiresIn: (
    isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
      : env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ),
  statusPort: env.STATUS_APP_PORT,
  telegramAccessToken: env.TELEGRAM_AUTH_KEY,
  telegramChatNotificationAlerts: env.TELEGRAM_NOTIFICATION_ALERTS_CHAT,
  trustedProxies: env.TRUSTED_PROXIES,

  rabbitPaymentNotificationQueueName: env.RABBIT_PAYMENT_NOTIFICATION_QUEUE_NAME,
};
