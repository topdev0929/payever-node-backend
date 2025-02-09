import { PePact, PactEnvConfig } from '@pe/pact-kit';

export const pactEnvConfig: PactEnvConfig = {
  ...PePact.parseEnv(),
  publish: {
    ...PePact.parseEnv().publish,
    consumerVersion: '2',
  },
};
