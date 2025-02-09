import { PactConfigurationInterface } from '@pe/pact-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ApplicationModule } from '../../../src/app.module';
import {
  ThirdPartyInventoryMessagesProvider,
  ThirdPartyProductsMessagesProvider, ThirdPartyMessagesMock, SubscriptionMessagesMock,
} from '../providers';
import {
  BusinessExistsHasAmazonAndConnectedWithExternalIdState,
  BusinessExistsHasEbayAndConnectedWithExternalIdState,
} from '../states';
import { ThirdPartyPaymentActionMessagesProvider } from '../providers/third-party-payment-action-messages.provider';

dotenv.config();
const env: any = process.env;

const participantName: string = 'nodejs-backend-third-party';

env.PACT_CONSUMER_PORT = env.PACT_CONSUMER_PORT || '3005';

export const pactConfiguration: PactConfigurationInterface = {
  consumer: {
    consumer: participantName,
    consumerVersion: env.PACT_CONSUMER_VERSION,
    dir: path.resolve(process.cwd(), 'pacts'),
    log: path.resolve(process.cwd(), 'pact.log'),
    port: Number(env.PACT_CONSUMER_PORT),
    spec: 2,
  },
  options: {
    importModules: [ApplicationModule],
    providers: [],
    rabbitMessagesProviders: [
      SubscriptionMessagesMock,
      ThirdPartyInventoryMessagesProvider,
      ThirdPartyProductsMessagesProvider,
      ThirdPartyMessagesMock,
      ThirdPartyPaymentActionMessagesProvider,
    ],
    states: [
      BusinessExistsHasAmazonAndConnectedWithExternalIdState,
      BusinessExistsHasEbayAndConnectedWithExternalIdState,
    ],
  },
  pactBroker: {
    consumerVersion: env.PACT_CONSUMER_VERSION,
    pactBroker: env.PACT_BROKER_BASE_URL,
    pactBrokerPassword: env.PACT_BROKER_PASSWORD,
    pactBrokerUsername: env.PACT_BROKER_USERNAME,
    pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
    tags: env.PACT_ENV_TAGS ? env.PACT_ENV_TAGS.split(',').map(s => s.trim()) : [],
  },
  provider: {
    dir: path.resolve(process.cwd(), 'pacts'),
    log: path.resolve(process.cwd(), 'pact.log'),
    provider: participantName,
    port: Number(env.PACT_PROVIDER_PORT),
    providerBaseUrl: `http://localhost:${env.PACT_PROVIDER_PORT}`,
    providerStatesSetupUrl: `http://localhost:${env.PACT_PROVIDER_PORT}/api/setup`,
    providerVersion: env.PACT_CONSUMER_VERSION,
  },
};
