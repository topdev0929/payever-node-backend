import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { RabbitBinding } from '../../../src/environments';
import { IntegrationUninstalledMessageDto } from '../../../src/integrations/dtos';
import { PaymentMethodsEnum } from '../../../src/subscriptions/enums';
import { ProvidersEnum } from '../config';

const integrationUninstalledEventMatcher = {
  businessId: Matchers.uuid(),
  category: Matchers.string(),
  name: Matchers.term({
    matcher: Object.keys(PaymentMethodsEnum).join('|'),
    generate: PaymentMethodsEnum.paypal,
  })
};


const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: integrationUninstalledEventMatcher,
    dtoClass: IntegrationUninstalledMessageDto,
    name: RabbitBinding.ConnectThirdPartyUninstalled,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Connect);

describe('Receive connect bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
