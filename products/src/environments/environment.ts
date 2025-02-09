import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;
import { MongoError } from 'mongodb';
import { Error } from 'mongoose';
import { UserInputError } from 'apollo-server-errors';
import { getRpcQueueConfig } from '@pe/folders-plugin';
import { MessageBusChannelsEnum, RabbitExchangesEnum } from '../shared';

dotenv.config();
const env: ProcessEnv = process.env;
const isNumeric: (n: any) => boolean = (n: any): boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

function dynamicConsumerRoutingKey() {
  if (env.RABBIT_PRODUCT_QUEUE_NAME) {
    return env.RABBIT_PRODUCT_QUEUE_NAME;
  }

  return MessageBusChannelsEnum.productInward;
}


const getExchanges: () => any[] = (): any[] => {

  const exchanges: any[] = [
    {
      name: RabbitExchangesEnum.asyncEvents,
      options: { durable: true },
      type: 'direct',

      queues: [
        {
          name: MessageBusChannelsEnum.products,
          options: {
            deadLetterExchange: 'async_events_fallback',
            deadLetterRoutingKey: MessageBusChannelsEnum.products,
            durable: true,
          },
        },
      ],
    },
    {
      name: RabbitExchangesEnum.rpcCalls,
      options: { durable: false, arguments: { 'x-message-ttl': 30000 } },
      type: 'direct',

      queues: [
        getRpcQueueConfig(MessageBusChannelsEnum.productsRpc),
      ],
    },
    {
      name: RabbitExchangesEnum.productsFolders,
      options: { durable: true },
      type: 'direct',

      queues: [
        {
          name: MessageBusChannelsEnum.productsFolders,
          options: {
            deadLetterExchange: 'products_folders_fallback',
            deadLetterRoutingKey: MessageBusChannelsEnum.productsFolders,
            durable: true,
          },
        },
      ],
    },
    {
      name: RabbitExchangesEnum.bulkProduct,
      options: { durable: true },
      type: 'direct',
      queues: [
        {
          consumerDependent: true,
          name: dynamicConsumerRoutingKey(),
          options: {
            deadLetterExchange: 'products_bulk_fallback',
            deadLetterRoutingKey: dynamicConsumerRoutingKey(),
            autoDelete: true,
            durable: true,
          },
        },
      ],
    },
  ];

  if (env.PRODUCTION_MODE === 'true') {
    return exchanges;
  }

  return exchanges;
};



export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  cucumberTest: env.CUCUMBER_TEST === 'true',
  elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
  elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
  elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
  elasticSearchHost: env.ELASTIC_HOST,
  statusPort: env.STATUS_APP_PORT,
  storage: env.MICRO_URL_CUSTOM_STORAGE,

  microUrlCheckout: env.MICRO_URL_FRONTEND_CHECKOUT_WRAPPER,
  microUrlInventory: env.MICRO_URL_INVENTORY_INTERNAL,
  microUrlMedia: env.MICRO_URL_MEDIA_INTERNAL,
  microUrlPos: env.MICRO_URL_POS,
  microUrlShops: env.MICRO_URL_SHOPS,
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,

  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },

  mongodb: env.MONGODB_URL,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  rabbitmq: {
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,

    exchanges: getExchanges(),
    isGlobalPrefetchCount: false,
    prefetchCount: 1,

    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
  },

  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      centralConfig: env.ELASTIC_APM_CENTRAL_CONFIG,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
      skipExceptions: [
        MongoError,
        Error.ValidationError,
        UserInputError,
      ],
    },
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

  test: env.TEST === 'true',

  webSocket: {
    port: env.WS_PORT,
    wsMicro: env.MICRO_WS_PRODUCTS_INTERNAL,
  },
  rabbitProductQueueName: env.RABBIT_PRODUCT_QUEUE_NAME,

  azure: {
    mlAccountUrl: env.AZURE_ML_ACCOUNT_URL || '',
    mlContainerName: env.AZURE_ML_CONTAINER_NAME || '',
    mlCredential: env.AZURE_ML_CREDENTIAL || '',
    categoryMlBlobName: env.AZURE_ML_CATEGORY_BLOB_NAME || '',
    categoryMlTextVectorizerDataFile: env.AZURE_ML_CATEGORY_TEXT_VECTORIZER_DATA_FILE || '',
    mlConnectionString: env.AZURE_ML_CONNECTION_STRING || '',
  },
  productCategory: env.CATEGORY_PRODUCT,
  categoryPredictUrl: env.MICRO_URL_PREDICTION_API_INTERNAL,
  pythonAppPort: env.PYTHON_APP_PORT,
};
