import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { BusinessMediaEventDto } from '../../../src/spotlight/apps/studio-app/dto';
import { StudioRabbitMessagesEnum, MediaTypeEnum } from '../../../src/spotlight/apps/studio-app/enums';
import { ProvidersEnum } from '../config';

const studioEventMatcher = {
  id: Matchers.uuid(),
  name: Matchers.string(),
  business: {
    id: Matchers.uuid()
  },
  mediaType: `${MediaTypeEnum.IMAGE}|${MediaTypeEnum.TEXT}|${MediaTypeEnum.VIDEO}`,
  url: Matchers.string(),
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: studioEventMatcher,
    dtoClass: BusinessMediaEventDto,
    name: StudioRabbitMessagesEnum.BusinessMediaCreated,
  },
  {
    contentMatcher: studioEventMatcher,
    dtoClass: BusinessMediaEventDto,
    name: StudioRabbitMessagesEnum.BusinessMediaUpdated,
  },
  {
    contentMatcher: studioEventMatcher,
    dtoClass: BusinessMediaEventDto,
    name: StudioRabbitMessagesEnum.BusinessMediaDeleted,
  }
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Studio);

describe('Receive studio bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
