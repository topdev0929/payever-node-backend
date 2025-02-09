import { Error } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

import { parseEnvVarAsInt } from '@pe/nest-kit';
import { MessageBusChannelsEnum } from '../common';

const isNumeric: (n: any) => boolean = (n: any): boolean => {
  return !isNaN(parseInt(n, 10)) && isFinite(n);
};

dotenv.config();
const env: NodeJS.ProcessEnv = process.env;

export const environment: any = {
  adminEmail: env.ADMIN_EMAIL,
  apm: {
    enable: env.APM_SERVICE_ENABLE === 'true',
    options: {
      active: env.ELASTIC_APM_ACTIVE,
      centralConfig: env.ELASTIC_APM_CENTRAL_CONFIG,
      logLevel: env.ELASTIC_APM_LOG_LEVEL,
      serverUrl: env.ELASTIC_APM_SERVER_URL,
      serviceName: env.ELASTIC_APM_SERVICE_NAME,
      skipExceptions: [Error.ValidationError],
    },
  },
  appNamespace: env.APP_NAMESPACE,
  applicationName: env.APP_NAME,
  blockedEmailDomainFileUrl: env.BLOCKED_EMAIL_DOMAIN_FILE_URL,
  commerceOSRegisterUrl: `${env.MICRO_URL_FRONTEND_COMMERCEOS}/registration/business`,
  commerseOSUrl: env.MICRO_URL_FRONTEND_COMMERCEOS,
  disableLocation2fa: env.DISABLE_LOCATION_2FA,
  elasticSearchAuthPassword: env.ELASTIC_AUTH_PASSWORD,
  elasticSearchAuthUsername: env.ELASTIC_AUTH_USERNAME,
  elasticSearchCloudId: env.ELASTIC_CLOUD_ID,
  elasticSearchHost: env.ELASTIC_HOST,
  enableBruteforceProtection: process.env.ENABLE_BRUTEFORCE_PROTECTION !== 'false',
  encryption: {
    masterKey: env.AUTH_ENCRYPTION_KEY.replace(/\|\|n\|\|/g, '\n'),
  },
  fbAppId: env.FB_APP_ID,
  fbAppSecret: env.FB_APP_SECRET,
  fbRedirectUrl: env.FB_REDIRECT_URL,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_SECRET,
  googleRedirectUrl: env.GOOGLE_REDIRCT_URL,
  guestTokenExpiresIn: (
    isNumeric(env.GUEST_TOKEN_EXPIRES_IN)
      ? parseInt(env.GUEST_TOKEN_EXPIRES_IN, 10)
      : env.GUEST_TOKEN_EXPIRES_IN
  ),
  loginReturnUrl: `${env.MICRO_HOST_COMMERCEOS_SOCIAL_LOGIN}/login/social-login`,

  jwtOptions: {
    // this should be set to PEM encoded private key for RSA/ECDSA for production
    // @see https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
    secret: env.JWT_SECRET_TOKEN,
    signOptions: {
      expiresIn: isNumeric(env.JWT_EXPIRES_IN) ? parseInt(env.JWT_EXPIRES_IN, 10) : env.JWT_EXPIRES_IN,
    },
  },
  mongodb: env.MONGODB_URL,
  oauthTokenExpiresIn: isNumeric(env.OAUTH_EXPIRES_IN) ? parseInt(env.OAUTH_EXPIRES_IN, 10) : env.OAUTH_EXPIRES_IN,
  oauthTokenInCookie: {
    allow: true,
    //  @TODO: remove default value
    domain: env.TOKEN_IN_COOKIE_DOMAIN || 'test.devpayever.com',
  },
  organizationTokenExpiresIn: parseEnvVarAsInt(env.ORGANIZATION_TOKEN_EXPIRES_IN),
  organizationTokenExpiresInString: env.ORGANIZATION_TOKEN_EXPIRES_IN,
  port: env.APP_PORT,
  production: env.PRODUCTION_MODE === 'true',

  rabbitmq: {
    expireInMS: 10000,
    managementUrl: env.RABBITMQ_MANAGEMENT_URL,
    shouldLogEvents: (env.RABBITMQ_SHOULD_LOG_EVENTS ?? 'true') === 'true',
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
            name: MessageBusChannelsEnum.auth,
            options: {
              deadLetterExchange: 'async_events_fallback',
              deadLetterRoutingKey: MessageBusChannelsEnum.auth,
              durable: true,
            },
          },
        ],
      },
    ],
  },
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
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
  rsa: {
    private: path.resolve(env.RABBITMQ_CERTIFICATE_PATH),
  },
  statusPort: env.STATUS_APP_PORT,
  trustedProxies: env.TRUSTED_PROXIES,
};
