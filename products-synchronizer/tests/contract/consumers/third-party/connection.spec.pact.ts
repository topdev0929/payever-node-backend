import 'reflect-metadata';
import { MessageConsumerPact, Matchers } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import {
  ThirdPartyConnectedMessageDto,
  ThirdPartyDisconnectedMessageDto,
} from '../../../../src/synchronizer/dto/third-party-rabbit-messages';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messages: any[] = [
  {
    contentMatcher: {
      authorizationId: Matchers.uuid(),
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integraton_name'),
      },
    },
    dtoClass: ThirdPartyConnectedMessageDto,
    name: 'third-party.event.third-party.connected',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      integration: {
        name: Matchers.like('some_integraton_name'),
      },
    },
    dtoClass: ThirdPartyDisconnectedMessageDto,
    name: 'third-party.event.third-party.disconnected',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.ThirdParty,
);

describe('Receive third party micro connection message', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
