import 'mocha';
import { ChannelSetExpectedMessages } from './channel-set-expected-messsage';
import { MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../../config';

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Marketing,
);

describe('Receive channelset bus messages from Marketing', () => {
  for (const message of ChannelSetExpectedMessages) {
    it(`Accepts valid "${message.name}"messages`, () => {
      return asyncConsumerChecker(messagePact, message)
    })
  }
});
