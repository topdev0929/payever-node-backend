import 'mocha';
import { ExpectedMessageDto, PePact, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { CampaignCreateDto } from '../../../src/apps/marketing-app/dto';
import { pactConfiguration, ProvidersEnum } from '../config';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: Matchers.uuid(),
      channelSet: Matchers.uuid(),
      contactsCount: Matchers.like(13),
      id: Matchers.uuid(),
      name: Matchers.like('Some name'),
    },
    dtoClass: CampaignCreateDto,
    name: 'marketing.event.campaign-creation.done',
  },
];
const messagePact: MessageConsumerPact = PePact.getMessageConsumer(
  ProvidersEnum.Marketing,
);

describe('Receive business bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
