import 'mocha'
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { MediaContainersEnum, MediaDto, MediaRabbitEvents } from '@pe/media-sdk';
import { ProvidersEnum } from '../../config/providers.enum';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      container: Matchers.like(MediaContainersEnum.Images),
      filename: Matchers.like('file1.png'),
      relatedEntity: {
        id: Matchers.uuid(),
        type: Matchers.like('some type'),
      },
    },
    dtoClass: MediaDto,
    name: MediaRabbitEvents.MediaAssigned,
  },
  {
    contentMatcher: {
      container: Matchers.like(MediaContainersEnum.Images),
      filename: Matchers.like('file1.png'),
      relatedEntity: {
        id: Matchers.uuid(),
        type: Matchers.like('some type'),
      },
    },
    dtoClass: MediaDto,
    name: MediaRabbitEvents.MediaRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Builder);

describe('Receive media bus messages from Pos', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
