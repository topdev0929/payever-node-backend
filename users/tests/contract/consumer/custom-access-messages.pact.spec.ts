import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';
import { CurrentWallpaperBusDto } from '../../../src/user/dto';
import { CustomAccessDeletedDto, CustomAccessExportDto, CustomAccessMessageDto } from '../../../src/custom-access/dtos';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      customAccess: []
    },
    dtoClass: CustomAccessExportDto,
    name: 'builder.event.custom-access.exported',
  },
  {
    contentMatcher: {
      customAccess: {}
    },
    dtoClass: CustomAccessMessageDto,
    name: 'builder.event.custom-access.created',
  },
  {
    contentMatcher: {
      customAccess: {}
    },
    dtoClass: CustomAccessMessageDto,
    name: 'builder.event.custom-access.updated',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      currentWallpaper: {}
    },
    dtoClass: CustomAccessDeletedDto,
    name: 'builder.event.custom-access.deleted',
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
