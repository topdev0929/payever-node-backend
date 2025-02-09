// tslint:disable object-literal-sort-keys
import * as dotenv from 'dotenv';

import {
  parseEnvVarAsBoolean,
  parseEnvVarAsInt,
  parsePlainEnv,
} from '@pe/nest-kit';

import { AppConfigDtoLocal } from './environment.dto';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../message/enums';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: AppConfigDtoLocal = parsePlainEnv({
  debounceEvents: {
    wait: 5000,
    maxWait: 10000,
  },
  appCors: false,
  production: parseEnvVarAsBoolean(env.PRODUCTION_MODE),

  wsPort: parseEnvVarAsInt(env.WS_PORT),
  wsMicro: env.MICRO_WS_MESSAGE_INTERNAL,

  applicationName: env.APP_NAME,
  port: parseEnvVarAsInt(env.APP_PORT),
  statusPort: parseEnvVarAsInt(env.STATUS_APP_PORT),

  mongodb: env.MONGODB_URL,

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
  },

  redis: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST,
    connectTimeout: parseInt(env.REDIS_CONNECT_TIMEOUT, 10),
    password: env.REDIS_PASSWORD,
    port: parseInt(env.REDIS_PORT, 10),
    retryAttempts: parseInt(env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(env.REDIS_RETRY_DELAY, 10),
    clusterHosts: env.REDIS_CLUSTER_HOSTS.split(','),
  },

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: parseEnvVarAsInt(env.JWT_EXPIRES_IN),
    },
  },

  refreshTokenExpiresIn: -1,
  apm: {
    enable: false,
    options: null,
  },

  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    stompBrokerUrl: env.RABBITMQ_STOMP_URL,

    exchanges: [
      {
        name: RabbitExchangesEnum.asyncEvents,
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.Message,
          options: {
            deadLetterExchange: 'async_events_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.Message,
            durable: true,
          },
        }],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.messageFolders,
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.MessageFolders,
          options: {
            deadLetterExchange: 'message_folders_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.MessageFolders,
            durable: true,
          },
        }],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.messageFoldersExport,
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.MessageFoldersExport,
          options: {
            deadLetterExchange: 'message_folders_export_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.MessageFoldersExport,
            durable: true,
          },
        }],
        type: 'direct',
      },
    ],

    isGlobalPrefetchCount: false,
    prefetchCount: 1,
  },

  encryption: {
    masterKey: env.MASTER_KEY.replace(/\|\|n\|\|/g, '\n'),
  },

  authMicroBaseUrl: env.MICRO_URL_AUTH_INTERNAL,
  whatsappMicroUrl: env.MICRO_URL_CONNECT_WHATSAPP_INTERNAL,
  facebookMessengerMicroUrl: env.MICRO_URL_CONNECT_FACEBOOK_MESSENGER_INTERNAL,
  instagramMessengerMicroUrl: env.MICRO_URL_CONNECT_INSTAGRAM_MESSENGER_INTERNAL,
  thirdPartyMessengerMicroUrl: env.MICRO_URL_THIRD_PARTY_MESSENGER_INTERNAL,

  other: {
    shopUrl: env.MICRO_URL_SHOP_INTERNAL + '/api',
  },

  dbConsumerPrefetchCount: parseEnvVarAsInt(env.DB_CONSUMER_PREFETCH_COUNT || '1'),
  stompDefaultPrefetchCount: parseEnvVarAsInt(env.STOMP_DEFAULT_PREFETCH_COUNT || '10'),

  pact: parseEnvVarAsBoolean(env.PACT),
}, AppConfigDtoLocal);
