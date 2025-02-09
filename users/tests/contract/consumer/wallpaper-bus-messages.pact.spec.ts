import 'mocha';
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../config';
import { CurrentWallpaperBusDto } from '../../../src/user/dto';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      currentWallpaper: {}
    },
    dtoClass: CurrentWallpaperBusDto,
    name: 'wallpapers.event.business-wallpaper.current-exported',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      currentWallpaper: {}
    },
    dtoClass: CurrentWallpaperBusDto,
    name: 'wallpapers.event.business-wallpaper.current-updated',
  },
  {
    contentMatcher: {
      businessId: Matchers.uuid(),
      currentWallpaper: {}
    },
    dtoClass: CurrentWallpaperBusDto,
    name: 'wallpapers.rpc.business-wallpaper.current-exported',
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
