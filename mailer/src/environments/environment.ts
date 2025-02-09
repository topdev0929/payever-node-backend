import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum } from '../mailer/enum';
import ProcessEnv = NodeJS.ProcessEnv;

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
  appNameSpace: env.APP_NAMESPACE,
  applicationName: env.APP_NAME,
  blobStorageUrl: env.MICRO_URL_CUSTOM_STORAGE,
  commerseOSUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
  defaultLanguage: 'en',
  disableDelivery: env.MAIL_DISABLE_DELIVERY === 'true',
  explicitDeliveryAddresses: env.MAIL_DELIVERY_ADDRESSES
    ? env.MAIL_DELIVERY_ADDRESSES.replace(/\s/g, '').split(',')
    : null,
  from: env.MAIL_FROM,
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },
  mailerConfigDkim: {
    cacheDir: '/tmp',
    cacheTreshold: 100 * 1024,
    domainName: env.DKIM_DOMAIN,
    keySelector: env.DKIM_SELECTOR,
    privateKey: env.DKIM_KEY.replace(/\|\|n\|\|/g, '\n'),
  },
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.mailer,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.mailer,
              durable: true,
            },
          },
        ],
        type: 'direct',
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
    port: +process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
  twigDebug: env.TWIG_DEBUG,
  twigStrictVariables: env.TWIG_STRICT_VARIABLES === 'true',
};
