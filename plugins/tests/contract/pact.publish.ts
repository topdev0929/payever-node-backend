import { Publisher } from '@pact-foundation/pact-node';
import { pactConfiguration } from './config';

(async (): Promise<void> => {
  const publisher: Publisher = new Publisher(pactConfiguration.pactBroker);
  await publisher.publish();
})();
