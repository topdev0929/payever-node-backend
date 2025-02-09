import * as dotenv from 'dotenv';
import * as path from 'path';
import {
  parseEnvVarAsInt,
  parseEnvVarAsBoolean,
  parsePlainEnv,
} from '@pe/nest-kit';

import { RabbitChannel } from './rabbit-channel.enum';
import ProcessEnv = NodeJS.ProcessEnv;
import { AppConfigDtoLocal } from './environment.dto';

dotenv.config();
const env: ProcessEnv = process.env;

export const environment: AppConfigDtoLocal = parsePlainEnv(
  {
    appCors: env.APP_CORS === 'true',
    production: env.PRODUCTION_MODE === 'true',

    applicationName: env.APP_NAME,
    port: parseEnvVarAsInt(env.APP_PORT),
    statusPort: parseEnvVarAsInt(env.STATUS_APP_PORT),

    microservices: {
      authUrl: env.MICRO_URL_AUTH_INTERNAL,
      checkoutCdnUrl: env.MICRO_URL_CHECKOUT_CDN,
      checkoutUrl: env.MICRO_URL_CHECKOUT_INTERNAL,
      commerceosFrontendUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
      commerceosUrl: env.MICRO_URL_COMMERCEOS,
      communicationsThirdPartyUrl: env.MICRO_URL_THIRD_PARTY_COMMUNICATIONS_INTERNAL,
      configuratorUrl: env.MICRO_URL_THIRD_PARTY_CONFIGURATOR,
      connectUrl: env.MICRO_URL_CONNECT_INTERNAL,
      customStorage: env.MICRO_URL_CUSTOM_STORAGE,
      devicePaymentsUrl: env.MICRO_URL_DEVICE_PAYMENTS_INTERNAL,
      mediaUrl: env.MICRO_URL_MEDIA,
      paymentThirdPartyUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS_INTERNAL,
      pluginsUrl: env.MICRO_URL_PLUGINS,
      posBuilderUrl: env.MICRO_URL_BUILDER_POS,
      posUrl: env.MICRO_URL_POS_INTERNAL,
      qrUrl: env.MICRO_URL_CONNECT_QR_INTERNAL,
      usersUrl: env.MICRO_URL_USERS_INTERNAL,
      wallpapersUrl: env.MICRO_URL_WALLPAPERS_INTERNAL,
    },


    webSocket: {
      port: parseEnvVarAsInt(env.WS_PORT),
    },

    mongodb: env.MONGODB_URL,

    redis: {
      clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
      connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
      retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
      url: env.REDIS_URL,
    },
    refreshTokenExpiresIn: parseEnvVarAsInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN),

    jwtOptions: {
      // this should be set to PEM encoded private key for RSA/ECDSA for production
      // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      secret: env.JWT_SECRET_TOKEN,
      signOptions: {
        expiresIn: parseEnvVarAsInt(env.JWT_EXPIRES_IN),
      },
    },

    organizationTokenExpiresIn: parseEnvVarAsInt(env.ORGANIZATION_TOKEN_EXPIRES_IN),
    organizationTokenExpiresInString: env.ORGANIZATION_TOKEN_EXPIRES_IN,

    rabbitmq: {
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
              name: RabbitChannel.OnboardingCreated,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: RabbitChannel.OnboardingCreated,
                durable: true,
              },
            },
            {
              name: RabbitChannel.OnboardingProcessed,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: RabbitChannel.OnboardingProcessed,
                durable: true,
              },
            },
            {
              name: RabbitChannel.OnboardingReport,
              options: {
                deadLetterExchange: 'async_events_fallback',
                deadLetterRoutingKey: RabbitChannel.OnboardingReport,
                durable: true,
              },
            },
          ],
        },
      ],

      isGlobalPrefetchCount: false,
      prefetchCount: 10,
      rsa: {
        private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
      },
    },


    apm: {
      enable: env.APM_SERVICE_ENABLE === 'true',
      options: {
        active: parseEnvVarAsBoolean(env.ELASTIC_APM_ACTIVE),
        logLevel: env.ELASTIC_APM_LOG_LEVEL as any,
        serverUrl: env.ELASTIC_APM_SERVER_URL,
        serviceName: env.ELASTIC_APM_SERVICE_NAME,
      },
    },

    processorDelayMs: parseEnvVarAsInt(env.PROCESSOR_DELAY) || 5000,
  },
  AppConfigDtoLocal,
);
