import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;
import { RabbitChannelsEnum } from '../sites/enums';

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  production: env.PRODUCTION_MODE === 'true',

  port: env.APP_PORT,
  statusPort: env.STATUS_APP_PORT,

  sitesDomain: (process.env.BUILDER_SITE_DOMAINS || '').replace('DOMAIN.', ''),

  postgres: {
    database: env.POSTGRES_DATABASE,
    host: env.POSTGRES_HOST || 'localhost',
    password: env.POSTGRES_PASSWORD,
    port: parseInt(env.POSTGRES_PORT, 10) || 5432,
    synchronize: true,
    type: 'postgres',
    username: env.POSTGRES_USER,
  },

  mongodb: env.MONGODB_URL,
  redis: {
    clusterHosts: process.env.REDIS_CLUSTER_HOSTS.split(','),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT, 10),
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD,
    port: +process.env.REDIS_PORT,
    retryAttempts: parseInt(process.env.REDIS_RETRY_ATTEMPTS, 10),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY, 10),
    url: env.REDIS_URL,
  },
  refreshTokenExpiresIn: (isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN) ?
    parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10) :
    env.JWT_REFRESH_TOKEN_EXPIRES_IN),

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
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
  rabbitmq: {
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [
          {
            name: RabbitChannelsEnum.Site,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: RabbitChannelsEnum.Site,
              durable: true,
            },
          },
        ],
        type: 'direct',
      },
      {
        name: 'rpc_calls',
        type: 'direct',

        options: { durable: false, arguments: { 'x-message-ttl': 30000 } },
        queues: [
          {
            name: RabbitChannelsEnum.Rpc,
            options: {
                autoDelete: false,
                durable: false,
                messageTtl: 30 * 1000,
            },
          },
        ],
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

  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      // active: env.ELASTIC_APM_ACTIVE,
      // centralConfig: env.ELASTIC_APM_CENTRAL_CONFIG,
      // logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
    },
  },

  kubernetesIngressNamespace: env.KUBERNETES_INGRESS_NAMESPACE,
  kubernetesIngressPrefix: env.KUBERNETES_INGRESS_PREFIX,
  kubernetesIngressTemplate: env.KUBERNETES_INGRESS_TEMPLATE,
  kubernetesPayloadDefaultTemplate: path.resolve('./data/default-template.json'),

  kubernetesIngressRewriteTemplate: env.KUBERNETES_INGRESS_REWRITE_TEMPLATE,
  kubernetesPayloadDefaultRewriteTemplate: path.resolve('./data/ingress-rewrite.template.json'),
};
