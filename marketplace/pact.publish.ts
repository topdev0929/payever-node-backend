import { Publisher } from '@pact-foundation/pact-node';
import { pactConfiguration } from './tests/contract/config';

// tslint:disable-next-line no-floating-promises
(async (): Promise<void> => {
  const publisher: Publisher = new Publisher(pactConfiguration.pactBroker);
  await publisher.publish();
})();
