import { PactEnvConfig } from '@pe/pact-kit';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { ApplicationModule } from '../../../src/app.module';
import { WidgetsEventMessagesMock } from '../providers/widgets-events-producer.mock.spec';

dotenv.config();
const env: any = process.env;

const participantName: string = env.APP_NAME;

env.PACT_CONSUMER_PORT = env.PACT_CONSUMER_PORT || '3005';
env.PACT_CONSUMER_VERSION = env.PACT_CONSUMER_VERSION || '1';
env.PACT_BROKER_BASE_URL = env.PACT_BROKER_BASE_URL || `http://localhost:${env.PACT_PROVIDER_PORT}`;
env.PACT_BROKER_PASSWORD = env.PACT_BROKER_PASSWORD || '';
env.PACT_BROKER_USERNAME = env.PACT_BROKER_USERNAME || '';

export const pactConfiguration: PactEnvConfig = {
  consumer: {
    dir: path.resolve(process.cwd(), 'pacts'),
    log: path.resolve(process.cwd(), 'pact.log'),
    port: Number(env.PACT_CONSUMER_PORT),
    spec: 2,
  },
  publish: {
    consumerVersion: env.PACT_CONSUMER_VERSION,
    pactBroker: env.PACT_BROKER_BASE_URL,
    pactBrokerPassword: env.PACT_BROKER_PASSWORD,
    pactBrokerUsername: env.PACT_BROKER_USERNAME,
    pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
    tags: env.PACT_ENV_TAGS ? env.PACT_ENV_TAGS.split(',').map((s: string) => s.trim()) : [],
  },
  provider: {
    provider: participantName,
    providerHost: `http://localhost:${env.PACT_PROVIDER_PORT}`,
    providerStatesSetupUrl: `http://localhost:${env.PACT_PROVIDER_PORT}/api/setup`,
    providerVersion: env.PACT_CONSUMER_VERSION,
  },
};
