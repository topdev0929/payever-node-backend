import * as dotenv from 'dotenv';
import * as path from 'path';
import ProcessEnv = NodeJS.ProcessEnv;

dotenv.config();
const env: ProcessEnv = process.env;

const isNumeric: (n: any) => boolean =
  (n: any): boolean => !isNaN(parseInt(n, 10)) && isFinite(n)
;

export const environment: any = {
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      captureSpanStackTraces:
        env.ELASTIC_APM_CAPTURE_SPAN_STACK_TRACES ? env.ELASTIC_APM_CAPTURE_SPAN_STACK_TRACES : false,
      disableInstrumentations: env.ELASTIC_APM_DISABLE_INSTRUMENTATIONS ? env.ELASTIC_APM_DISABLE_INSTRUMENTATIONS : [
        'express',
        'https',
      ],
      instrument: env.ELASTIC_APM_INSTRUMENT ? env.ELASTIC_APM_INSTRUMENT : false,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
      spanFramesMinDuration: env.ELASTIC_APM_SPAN_FRAMES_MIN_DURATION ? env.ELASTIC_APM_SPAN_FRAMES_MIN_DURATION : '1s',
      transactionSampleRate: env.ELASTIC_APM_TRANSACTION_SAMPLE_RATE ?  env.ELASTIC_APM_TRANSACTION_SAMPLE_RATE : 0.01,
    },
  },
  appCors: env.APP_CORS === 'true',
  applicationName: env.APP_NAME,
  checkoutPHPMicroUrl: env.MICRO_URL_PHP_CHECKOUT,
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
            name: 'async_events_finance_express_micro',
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: 'async_events_finance_express_micro',
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
  refreshTokenExpiresIn: (isNumeric(env.JWT_REFRESH_TOKEN_EXPIRES_IN) ?
    parseInt(env.JWT_REFRESH_TOKEN_EXPIRES_IN, 10) :
    env.JWT_REFRESH_TOKEN_EXPIRES_IN),
  statusPort: env.STATUS_APP_PORT,
  thirdPartyPaymentsUrl: env.MICRO_URL_THIRD_PARTY_PAYMENTS,
};
