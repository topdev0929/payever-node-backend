import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { ImportEventsService } from '../../../src/file-imports/service';
import { ImportFailedEventName } from '../../../src/file-imports/interfaces';

export class ImportFailedProvider extends AbstractMessageMock{
  @PactRabbitMqMessageProvider(ImportFailedEventName)
  public async mockImportFailed(): Promise<void> {
    const producer: ImportEventsService = await this.getProvider<ImportEventsService>(ImportEventsService);
    await producer.sendImportFailedEvent({
      business: {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
      },
      synchronization: {
        taskId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      },
      data: {
        errorMessage: 'Some error message',
      },
    });
  }
}
