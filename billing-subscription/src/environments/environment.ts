import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;
import { PaymentMethodsEnum } from '../subscriptions/enums';
import { RabbitChannelsEnum, RabbitExchangeEnum, RabbitExchangeFallbackEnum } from './rabbit-binding.enum';

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  billingSubscriptionUrl: env.MICRO_URL_BILLING_SUBSCRIPTION,
  payeverCNAME: env.PAYEVER_CNAME,
  payeverIP: env.PAYEVER_IP,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',
  statusPort: env.STATUS_APP_PORT,
  supportedIntegrations: [PaymentMethodsEnum.stripe, PaymentMethodsEnum.paypal],
  thirdPartyUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS,

  mongodb: env.MONGODB_URL,

  elasticEnv: {
    elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
    elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
    elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
    elasticSearchHost: env.ELASTIC_HOST,
  },

  redis: {
    clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: (
    isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
      ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
      : env.JWT_REFRESH_TOKEN_EXPIRES_IN
  ),

  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    jwtKeyExtractorOptions: {
      authScheme: env.JWT_AUTH_SCHEME,
      tokenBodyField: env.JWT_PARAM_NAME,
      tokenQueryParameterName: env.JWT_PARAM_NAME,
    },
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: (isNumeric(env.JWT_EXPIRES_IN)
          ? parseInt(env.JWT_EXPIRES_IN, 10)
          : env.JWT_EXPIRES_IN
      ),
    },
  },
  rabbitmq: {
    exchanges: [
      {
        name: RabbitExchangeEnum.AsyncEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.BillingSubscription,
            options: {
              deadLetterExchange: RabbitExchangeFallbackEnum.AsyncFallback,
              deadLetterRoutingKey: RabbitChannelsEnum.BillingSubscription,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitChannelsEnum.FolderBillingExportSubscription,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.FolderBillingExportSubscription,
            options: {
              deadLetterExchange: RabbitExchangeFallbackEnum.FolderExportFallback,
              deadLetterRoutingKey: RabbitChannelsEnum.FolderBillingExportSubscription,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: RabbitExchangeEnum.FolderEvents,
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.FolderBillingSubscription,
            options: {
              deadLetterExchange: RabbitExchangeFallbackEnum.FolderFallback,
              deadLetterRoutingKey: RabbitChannelsEnum.FolderBillingSubscription,
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
    rsa: {
      private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
    },
    urls: [env.RABBITMQ_URL],
    vhost: env.RABBITMQ_VHOST,
  },

  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },

  subscriptionsDomain: (env.BUILDER_SUBSCRIPTION_DOMAINS || '').replace('DOMAIN.', ''),

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
};
