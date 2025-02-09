import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';
import { RpcCreateBusinessDto, RpcRemoveBusinessDto } from '../../../src/user/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid('99a760c2-62e1-4ad5-bb03-faecadd624a1'),
        name: Matchers.like('some business name'),
        contactDetails: {
            lastName: Matchers.like('some lastName'),
        },
      },
      user: {},
      userId: Matchers.uuid(),
    },
    dtoClass: RpcCreateBusinessDto,
    name: 'users.rpc.business.create',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
    },
    dtoClass: RpcRemoveBusinessDto,
    name: 'users.rpc.business.delete',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.MailerReport);

describe('Receive auth bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
