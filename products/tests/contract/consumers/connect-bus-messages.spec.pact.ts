import 'reflect-metadata';
import { Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, PePact } from '@pe/pact-kit';
import { ProvidersEnum } from '../config';
import { RabbitEventNameEnum } from '../../../src/environments/rabbitmq';
import { IntegrationExported, IntegrationInstalledUninstalled, } from '../../../src/marketplace/dto';

const messages: any[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      category: Matchers.like('products'),
      name: Matchers.like('subscription name'),
    },
    dtoClass: IntegrationInstalledUninstalled,
    name: RabbitEventNameEnum.ThirdPartyInstalled,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      category: Matchers.like('products'),
      name: Matchers.like('subscription name'),
    },
    dtoClass: IntegrationInstalledUninstalled,
    name: RabbitEventNameEnum.ThirdPartyUninstalled,
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      id: Matchers.uuid(),
      installed: Matchers.like(false),
      name: Matchers.like('third party name'),
    },
    dtoClass: IntegrationExported,
    name: RabbitEventNameEnum.ThirdPartyExportedFromConnect,
  },
];

const messagePact = PePact.getMessageConsumer(ProvidersEnum.Connect);

describe('Receive connect micro message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
