import { RabbitMqConfigInterface } from '@pe/nest-kit';
import * as dotenv from 'dotenv';
import * as moment from 'moment';
import * as path from 'path';

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationApiKey: env.MARKETING_INTEGRATOR_API_KEY,
  applicationName: 'marketing-integrator',
  baseCrm: {
    accessToken: env.BASE_CRM_ACCESS_TOKEN,
    formLeadSourceId: 1104251,
  },
  geckoboard: {
    apiKey: env.GECKOBOARD_API_KEY,
  },
  ignoreEmails: ['business@payever.de', 'christophploenes@jploenes.de'],
  imap: {
    authTimeout: 3000,
    host: env.IMAP_HOST,
    password: env.IMAP_PASSWORD,
    port: Number(env.IMAP_PORT),
    tls: true,
    user: env.IMAP_USER,
  },
  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
  },
  mailchimp: {
    apiKey: env.MAILCHIMP_API_KEY,
    audienceId: env.MAILCHIMP_AUDIENCE_ID,
    baseUrl: env.MAILCHIMP_BASE_URL,
  },
  microUrlCommerceos: env.MICRO_URL_COMMERCEOS,
  microUrlUsers: env.MICRO_URL_USERS,
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
            name: 'async_events_marketing_integrator_micro',
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: 'async_events_marketing_integrator_micro',
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
  } as RabbitMqConfigInterface,

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
  statusPort: Number(env.STATUS_APP_PORT),
  syncFromDate: moment().subtract(14, 'hours'),
  synchronizationCron: env.CRM_SYNCHRONIZATION_SCHEDULE,
};
