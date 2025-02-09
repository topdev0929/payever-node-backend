import { ExpectedMessageDto, PePact, asyncConsumerChecker } from "@pe/pact-kit"
import { ProvidersEnum } from "../config"
import { Matchers } from '@pact-foundation/pact';
import { ToggleChannelSubscriptionDto } from "@pe/channels-sdk";

const messages: ExpectedMessageDto[] = [
  {
  	contentMatcher: {
      name: Matchers.like('Name'),
      businessId: Matchers.uuid()
    },
    dtoClass: ToggleChannelSubscriptionDto,
    name: 'connect.event.third-party.enabled',
  },
	{
  	contentMatcher: {
      name: Matchers.like('Name'),
      businessId: Matchers.uuid()
    },
    dtoClass: ToggleChannelSubscriptionDto,
    name: 'connect.event.third-party.disabled',
  },
];

const messagePactConnect = PePact.getMessageConsumer(ProvidersEnum.Connect)

describe('Receive channel subscription bus messages', () => {
	for (const message of messages) {
		it(`Accepts valid "${message.name}" messages`, () => {
			return asyncConsumerChecker(messagePactConnect, message);
		});
	}
})