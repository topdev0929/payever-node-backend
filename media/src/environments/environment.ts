import {
  parsePlainEnv,
  parseEnvVarAsBoolean,
  parseEnvVarAsInt,
} from '@pe/nest-kit';
import * as dotenv from 'dotenv';

import { MessageBusChannelsEnum } from '../media/enums';
import { LocalConfigDto } from './environment.dto';
import { restrictedWallpapersMediaList } from './restricted-wallpapers-media-list';

import ProcessEnv = NodeJS.ProcessEnv;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
  ;

dotenv.config();
const env: ProcessEnv = process.env;

export const environment: LocalConfigDto = parsePlainEnv(
  {
    apm: {
      enable: parseEnvVarAsBoolean(env.APM_SERVICE_ENABLE),
      options: {
        active: parseEnvVarAsBoolean(env.ELASTIC_APM_ACTIVE),
        centralConfig: parseEnvVarAsBoolean(env.ELASTIC_APM_CENTRAL_CONFIG),
        logLevel: env.ELASTIC_APM_LOG_LEVEL as any,
        serverUrl: env.ELASTIC_APM_SERVER_URL,
        serviceName: env.ELASTIC_APM_SERVICE_NAME,
      },
    },
    appCors: parseEnvVarAsBoolean(env.APP_CORS),
    applicationName: env.APP_NAME,
    internalBasicAuthLogin: env.MEDIA_CLIENT_USER,
    internalBasicAuthPassword: env.MEDIA_CLIENT_PASSWORD,
    jwtOptions: {
      jwtKeyExtractorOptions: {
        authScheme: env.JWT_AUTH_SCHEME,
        tokenBodyField: env.JWT_PARAM_NAME,
        tokenQueryParameterName: env.JWT_PARAM_NAME,
      },
      secret: env.JWT_SECRET_TOKEN,
      signOptions: {
        expiresIn: parseEnvVarAsInt(env.JWT_EXPIRES_IN),
      },
    },
    mongodb: env.MONGODB_URL,
    port: parseEnvVarAsInt(env.APP_PORT),
    production: parseEnvVarAsBoolean(env.PRODUCTION_MODE),
    rabbitmq: {
      exchanges: [
        {
          name: 'async_events',
          options: { durable: true },
          queues: [
            {
              name: MessageBusChannelsEnum.media,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: MessageBusChannelsEnum.media,
                durable: true,
              },
            },
            {
              name: MessageBusChannelsEnum.encoder,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: MessageBusChannelsEnum.encoder,
                durable: true,
              },
            },
            {
              name: MessageBusChannelsEnum.uploadRequests,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: MessageBusChannelsEnum.uploadRequests,
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
      port: parseInt(process.env.REDIS_PORT, 10),
      retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
      retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
      url: env.REDIS_URL,
    },
    restrictedWallpapersMediaList: restrictedWallpapersMediaList,
    statusPort: parseEnvVarAsInt(env.STATUS_APP_PORT),
    storage_account_name: env.STORAGE_ACCOUNT_NAME,
    storage_key: env.STORAGE_KEY,
    storage_url: env.MICRO_URL_CUSTOM_STORAGE,
    unusedMediaStoragePeriodDays: parseEnvVarAsInt(env.UNUSED_MEDIA_STORAGE_PERIOD_DAYS),

    refreshTokenExpiresIn: -1,

    clamd: {
      enabled: parseEnvVarAsBoolean(env.CLAMD_ENABLED),
      host: env.CLAMD_HOST,
      port: parseEnvVarAsInt(env.CLAMD_PORT),
    },
  },
  LocalConfigDto,
);
