import 'mocha'
import { PePact, ExpectedMessageDto, asyncConsumerChecker } from '@pe/pact-kit';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { ProvidersEnum } from '../../config/providers.enum';
import { ApplicationThemePublishedDto } from '@pe/builder-theme-kit';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      application: {
        id: Matchers.uuid(),
        type: Matchers.like('affiliate')
      },
      applicationTheme: {
        id: Matchers.uuid(),
        application: Matchers.like('affiliate'),
        theme: Matchers.like('some theme'),
      },
      compiled: {
          theme: {
            data: {
              example: Matchers.like('some example')
            },
            routing: Matchers.eachLike({
              routeId: Matchers.uuid(),
              url: Matchers.like('some url'),
              pageId: Matchers.uuid(),
            }),
            context: {
              example: {
                service: Matchers.like('some service'),
                method: Matchers.like('some method'),
                params: Matchers.eachLike(Matchers.string()),
              }
            },
            createdAt: Matchers.iso8601Date(),
            pages: Matchers.eachLike(Matchers.string)
          },
          themePages: Matchers.eachLike({
            id: Matchers.uuid(),
            name: Matchers.like('some name'),
            variant: Matchers.like('default'),
            data: {
              url: Matchers.like('some url'),
              mark: Matchers.like('some mark'),
              preview: Matchers.like('some preview'),
            },
            template: {
              type: Matchers.like('document')
            },
            stylesheet: {
              screen: {
                selector: {
                  style: Matchers.like('some style')
                }
              }
            },
            context: {
              example: {
                service: Matchers.like('some service'),
                method: Matchers.like('some method'),
                params: Matchers.eachLike(Matchers.string()),
              }
            }
          }),
      },
      id: Matchers.uuid(),
      isDeployed: Matchers.boolean(),
      theme: {
        id: Matchers.uuid(),
      },
      version: Matchers.uuid(),
      versionDiff: {
        pageIds: Matchers.eachLike(Matchers.uuid()),
      },
      wsKey: Matchers.like('some key'),
    },
    dtoClass: ApplicationThemePublishedDto,
    name: 'builder-affiliate.event.theme.published',
  },
];

const messagePact: MessageConsumerPact = PePact.getMessageConsumer(ProvidersEnum.Builder);

describe('Receive affiliates bus messages from builder', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
