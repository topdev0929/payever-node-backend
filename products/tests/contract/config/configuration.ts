import { PePact, PactEnvConfig } from '@pe/pact-kit';

export const pactEnvConfig: PactEnvConfig = PePact.parseEnv();
