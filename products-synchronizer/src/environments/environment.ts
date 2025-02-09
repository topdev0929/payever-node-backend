import * as dotenv from 'dotenv';
import * as path from 'path';

import { MessageBusExchangesEnum, RabbitChannelEnum } from './rabbit.enum';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean =>
  !isNaN(parseInt(n, 10)) && isFinite(n);


function dynamicConsumerRoutingKey() {
  if (env.RABBIT_PRODUCT_SYNC_QUEUE_NAME) {
    return env.RABBIT_PRODUCT_SYNC_QUEUE_NAME;
  }
  
  return RabbitChannelEnum.SynchronizerInward;
}


export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,
  mongodb: env.MONGODB_URL,
  synchronizationCron: env.SYNCHRONIZATION_CRON || '0 */12 * * *',
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
  removeStuckTasksCron: '* */1 * * *',
  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN)
        ? parseInt(env.JWT_EXPIRES_IN, 10)
        : env.JWT_EXPIRES_IN,
    },
  },
  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
    isGlobalPrefetchCount: false,
    prefetchCount: 10,
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        type: 'direct',
        queues: [
          {
            name: RabbitChannelEnum.Synchronizer,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelEnum.Synchronizer,
              durable: true,
            },
          },
          {
            name: RabbitChannelEnum.SynchronizerInventory,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelEnum.SynchronizerInventory,
              durable: true,
            },
          },
        ],
      },
      {
        name: MessageBusExchangesEnum.product_sync,
        options: { durable: true },
        type: 'direct',
        queues: [
          {
            consumerDependent: true,
            name: dynamicConsumerRoutingKey(),
            options: {
              deadLetterExchange: 'product_sync_trigger_fallback',
              deadLetterRoutingKey: dynamicConsumerRoutingKey(),
              autoDelete: true,
              durable: true,
            },
          },
        ],
      },
    ],
  },
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
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
  // following env will be set programmatically for dynamic consumer
  // NOTE: only in use for dynamic consumer
  rabbitProductSyncQueueName: env.RABBIT_PRODUCT_SYNC_QUEUE_NAME || RabbitChannelEnum.SynchronizerInward,
  synchronizationId: env.SYNCHRONIZATION_ID || '',
  routingKey: env.RABBIT_ROUTING_KEY || '1',
  taskId: env.TASK_ID || '',
  statusUrl: env.STATUS_URL,
};
