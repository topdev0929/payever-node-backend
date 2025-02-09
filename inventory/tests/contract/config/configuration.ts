import { PactEnvConfig, PePact } from '@pe/pact-kit';

export const pactEnvConfig: PactEnvConfig = PePact.parseEnv();
