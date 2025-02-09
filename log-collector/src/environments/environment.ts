import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;

import { MessageBusChannelsEnum, MessageExchangesEnum } from '../api-log/enums';

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n);

export const environment: any = {
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
    },
  },
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  jwtOptions: {
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
  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    exchanges: [
      {
        name: MessageExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.asyncEventsLogCollector,
            options: {
              deadLetterExchange: `${MessageExchangesEnum.asyncEvents}_fallback`,
              deadLetterRoutingKey: MessageBusChannelsEnum.asyncEventsLogCollector,
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
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },
  redis: {
    retryAttempts: env.REDIS_RETRY_ATTEMPTS,
    retryDelay: env.REDIS_RETRY_DELAY,
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
};
