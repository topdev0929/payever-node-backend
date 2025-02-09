import * as dotenv from 'dotenv';
import * as path from 'path';
import { RabbitChannelsEnum } from '../rabbitmq';
import ProcessEnv = NodeJS.ProcessEnv;

type IsNumericType = (n: any) => boolean;
const isNumeric: IsNumericType = (n: any) : boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

dotenv.config();
const env: ProcessEnv = process.env;

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
  elasticEnv: {
    authPassword: env.ELASTIC_AUTH_PASSWORD,
    authUsername: env.ELASTIC_AUTH_USERNAME,
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST || `http://localhost:9200`,
  },
  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN) ?
        parseInt(env.JWT_EXPIRES_IN, 10) :
        env.JWT_EXPIRES_IN),
    },
  },

  mailDomain: (process.env.BUILDER_MAIL_DOMAINS || '').replace('DOMAIN.', ''),

  microHostPrimaryMain: env.MICRO_HOST_PRIMARY_MAIN,
  microUrlBuilder: env.MICRO_URL_BUILDER,
  microUrlBuilderMail: env.MICRO_URL_BUILDER_MAIL,
  microUrlCustomStorage: env.MICRO_URL_CUSTOM_STORAGE,
  microUrlFrontendCommerceOS: env.MICRO_URL_FRONTEND_COMMERCEOS,
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
            name: RabbitChannelsEnum.Marketing,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Marketing,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
    ],
    isGlobalPrefetchCount: false,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    prefetchCount: 10,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },
  redis: {
    connect_timeout: env.REDIS_CONNECT_TIMEOUT,
    retryAttempts: env.REDIS_RETRY_ATTEMPTS,
    retryDelay: env.REDIS_RETRY_DELAY,
    url: env.REDIS_URL,
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
};
