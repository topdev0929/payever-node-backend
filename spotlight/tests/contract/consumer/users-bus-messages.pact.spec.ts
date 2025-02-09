import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { UserDto } from '../../../src/spotlight/apps/users-app/dto';
import { UserRabbitMessagesEnum } from '../../../src/spotlight/apps/users-app/enums';
import { ProvidersEnum } from '../config';

const userDtoMatcher = {
  businesses: Matchers.eachLike(Matchers.uuid()),
  _id: Matchers.uuid(),
  userAccount: {
    _id: Matchers.uuid(),
    language: Matchers.string(),
    salutation: Matchers.string(),
    firstName: Matchers.string(),
    lastName: Matchers.string(),
    phone: Matchers.string(),
    email: Matchers.email(),
    createdAt: Matchers.iso8601Date(),
    logo: Matchers.string(),
    hasUnfinishedBusinessRegistration: Matchers.boolean()
  }
};

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: userDtoMatcher,
    dtoClass: UserDto,
    name: UserRabbitMessagesEnum.UserCreated,
  },
  {
    contentMatcher: userDtoMatcher,
    dtoClass: UserDto,
    name: UserRabbitMessagesEnum.UserUpdated,
  },
  {
    contentMatcher: userDtoMatcher,
    dtoClass: UserDto,
    name: UserRabbitMessagesEnum.UserExported,
  },
  {
    contentMatcher: userDtoMatcher,
    dtoClass: UserDto,
    name: UserRabbitMessagesEnum.UserRemoved,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Users);

describe('Receive users bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      // console.log("TRANSFORMED MESSAGE:", new ClassTransformer().plainToClass(UserDto, message));
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
