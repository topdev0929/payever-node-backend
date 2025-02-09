import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, PePact } from '@pe/pact-kit';
import 'mocha';
import { ProvidersEnum } from '../config';
import * as dotenv from 'dotenv';
import { ApplicationMessageEnum } from '../../../src/builder/enums';
import { CreateApplicationDto, RemoveApplicationDto } from '../../../src/builder/dtos';

// override the env app name
process.env.APP_NAME = `nodejs-backend-builder`;

dotenv.config();

const prefix: string = `sites.event.site`;

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      id: Matchers.uuid(),
      business: {
        id: Matchers.uuid(),
      },
      type: 'site',
    },
    dtoClass: CreateApplicationDto,
    name: `${prefix}.${ApplicationMessageEnum.ApplicationCreated}`,
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
      business: {
        id: Matchers.uuid(),
      },
      type: 'site',
    },
    dtoClass: CreateApplicationDto,
    name: `${prefix}.${ApplicationMessageEnum.ApplicationExported}`,
  },
  {
    contentMatcher: {
      id: Matchers.uuid(),
    },
    dtoClass: RemoveApplicationDto,
    name: `${prefix}.${ApplicationMessageEnum.ApplicationRemoved}`,
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Site);

describe('Receive site bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
