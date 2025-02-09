import 'mocha';
import { Matchers, MessageConsumerPact } from '@pact-foundation/pact';
import { asyncConsumerChecker, ExpectedMessageDto, MessageConsumerPactFactory } from '@pe/pact-kit';
import { pactConfiguration, ProvidersEnum } from '../config';
import { FileImportTriggeredEventDto } from '../../../src/file-imports/dto';

const URL_REGEXP: string = '^http(s)?:\\/\\/.+';

const messages: ExpectedMessageDto[] = [
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      },
      fileImport: {
        fileUrl: Matchers.term({
          matcher: '^http(s)?:\\/\\/.+',
          generate: 'http://some.test.com/path-to-image.xml?with_query=some_value',
        }),
        overwriteExistent: Matchers.like(true),
      },
    },
    dtoClass: FileImportTriggeredEventDto,
    name: 'synchronizer.event.file-import.triggered no uploaded images',
  },
  {
    contentMatcher: {
      business: {
        id: Matchers.uuid(),
      },
      synchronization: {
        taskId: Matchers.uuid(),
      },
      fileImport: {
        fileUrl: Matchers.term({
          matcher: URL_REGEXP,
          generate: 'http://some.test.com/path-to-image.csv?with_query=some_value',
        }),
        overwriteExistent: Matchers.like(true),
        uploadedImages: Matchers.eachLike({
          originalName: Matchers.like('some_image_name.png'),
          url: Matchers.term({
            matcher: URL_REGEXP,
            generate: 'http://some.test.url/path-to-image.png?with_query=some_value',
          }),
        }),
      },
    },
    dtoClass: FileImportTriggeredEventDto,
    name: 'synchronizer.event.file-import.triggered with uploaded images',
  },
];

const messagePact: MessageConsumerPact = MessageConsumerPactFactory.fromConfig(
  pactConfiguration,
  ProvidersEnum.Synchronizer,
);

describe('Receive synchronizer bus messages', () => {
  for (const message of messages) {
    it(`Accepts valid "${message.name}" messages`, () => {
      return asyncConsumerChecker(messagePact, message);
    });
  }
});
