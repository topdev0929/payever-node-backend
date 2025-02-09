import * as dotenv from 'dotenv';
import * as path from 'path';
import { MessageBusChannelsEnum } from '../blog/enums';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean = (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n);

export const environment: any = {
  appCors: env.APP_CORS === 'true',
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',

  applicationName: env.APP_NAME,
  statusPort: env.STATUS_APP_PORT,

  blogsDomain: (process.env.BUILDER_BLOG_DOMAINS || '').replace('DOMAIN.', ''),

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
  refreshTokenExpiresIn: isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN)
    ? parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10)
    : env.JWT_REFRESH_TOKEN_EXPIRES_IN,

  jwtOptions: {
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },

  elastic: {
    cloudId: env.ELASTIC_CLOUD_ID,
    host: env.ELASTIC_HOST,
    password: env.ELASTIC_AUTH_PASSWORD,
    username: env.ELASTIC_AUTH_USERNAME,
  },

  rabbitmq: {
    exchanges: [
      {
        name: 'async_events',
        options: { durable: true },
        queues: [
          {
            name: MessageBusChannelsEnum.blog,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.blog,
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

  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
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

  appNamespace: env.APP_NAMESPACE,
  oauthTokenInCookie: {
    allow: true,
    //  @TODO: remove default value
    domain: env.TOKEN_IN_COOKIE_DOMAIN || 'test.devpayever.com',
  },
};
