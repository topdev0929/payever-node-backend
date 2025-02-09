import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { ImportEventsService } from '../../../src/file-imports/service';
import { ImportSuccessEventName } from '../../../src/file-imports/interfaces';
import { ImportedItemTypesEnum } from '../../../src/file-imports/enums';

export class ImportSuccessProvider extends AbstractMessageMock{
  @PactRabbitMqMessageProvider(ImportSuccessEventName)
  public async mockImportSuccess(): Promise<void> {
    const producer: ImportEventsService = await this.getProvider<ImportEventsService>(ImportEventsService);
    await producer.sendImportSuccessEvent(
      {
        business: {
          id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        },
        fileImport: {
          fileUrl: 'http://file.url',
          overwriteExistent: false,
        },
        synchronization: {
          taskId: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        },
      },
      [
        {
          sku: 'test_sku',
          type: ImportedItemTypesEnum.Inventory,
        },
        {
          sku: 'test_sku',
          type: ImportedItemTypesEnum.Product,
        },
        {
          sku: 'test_sku_2',
          type: ImportedItemTypesEnum.Product,
        },
      ],
      [
        {
          messages: ['Some error message'],
          sku: 'test_sku',
        },
      ],
    );
  }
}
