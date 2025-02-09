import 'mocha'
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../../config/providers.enum';
import { PostStateDto } from '../../../../src/social';
import { PostStatusEnum, RmqEventsEnum } from '../../../../src/social/enums';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      status: Matchers.like(PostStatusEnum.Succeeded),
      integrationName: Matchers.like('integration-name'),
      postId: Matchers.uuid(),
      postedAt: Matchers.iso8601Date(),
    },
    dtoClass: PostStateDto,
    name: RmqEventsEnum.postUpdate,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.ThirdParty);

describe('Receive social bus messages from Third Party', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});

