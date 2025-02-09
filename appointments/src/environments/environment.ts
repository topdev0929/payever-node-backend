// tslint:disable object-literal-sort-keys
import * as dotenv from 'dotenv';
import * as path from 'path';

import {
  parseEnvVarAsBoolean,
  parseEnvVarAsInt,
} from '@pe/nest-kit';

import { AppConfigDtoLocal } from './environment.dto';
import { RabbitChannelsEnum, RabbitExchangesEnum } from '../appointments/enums';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: AppConfigDtoLocal = {
  appCors: false,
  production: parseEnvVarAsBoolean(env.PRODUCTION_MODE),

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
    retryAttempts: parseEnvVarAsInt(env.REDIS_RETRY_ATTEMPTS),
    retryDelay: parseEnvVarAsInt(env.REDIS_RETRY_DELAY),
    url: env.REDIS_URL,
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

    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [{
          name: RabbitChannelsEnum.Appointments,
          options: {
            deadLetterExchange: 'async_events_fallback',
            deadLetterRoutingKey: RabbitChannelsEnum.Appointments,
            durable: true,
          },
        }],
        type: 'direct',
      },
      {
        name: RabbitExchangesEnum.appointmentsFolders,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.AppointmentsFolders,
            options: {
              deadLetterExchange: 'appointments_folders_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.AppointmentsFolders,
              durable: true,
            },
          },
        ],
      },
      {
        name: RabbitExchangesEnum.appointmentsFoldersExport,
        options: { durable: true },
        type: 'direct',

        queues: [
          {
            name: RabbitChannelsEnum.AppointmentsFoldersExport,
            options: {
              deadLetterExchange: 'appointments_folders_export_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.AppointmentsFoldersExport,
              durable: true,
            },
          },
        ],
      },
    ],
    isGlobalPrefetchCount: false,
    prefetchCount: 10,
  },

  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  whatsappMicroUrl: env.MICRO_URL_CONNECT_WHATSAPP,
  // facebookMessengerMicroUrl: env.MICRO_URL_CONNECT_FACEBOOK_MESSENGER,
  // instagramMessengerMicroUrl: env.MICRO_URL_CONNECT_INSTAGRAM_MESSENGER,
  // thirdPartyMessengerMicroUrl: env.MICRO_URL_THIRD_PARTY_MESSENGER,

  payeverCNAME: env.PAYEVER_CNAME,
  payeverIP: env.PAYEVER_IP,
  appointmentsDomain: env.APPOINTMENTS_DOMAIN,
};
