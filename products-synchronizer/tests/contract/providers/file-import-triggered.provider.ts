import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { InnerEventProducer } from '../../../src/synchronizer/producers';
import { SynchronizationTaskModel } from '@pe/synchronizer-kit';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

export class FileImportTriggeredProvider extends AbstractMessageMock{
  @PactRabbitMqMessageProvider('synchronizer.event.file-import.triggered no uploaded images')
  public async mockFileImportTriggeredNoUploadedImages(): Promise<void> {

    const synchronizationTaskMock: any = {
      business: {
        id: BUSINESS_ID,
      },
      fileImport: {
        fileUrl: 'http://some-file.url',
        overwriteExistent: false,
      },
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      populate: mockPopulate,
    };

    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.emitFileImportTriggeredEvent(synchronizationTaskMock as SynchronizationTaskModel);
  }

  @PactRabbitMqMessageProvider('synchronizer.event.file-import.triggered with uploaded images')
  public async mockFileImportTriggeredWithUploadedImages(): Promise<void> {

    const synchronizationTaskMock: any = {
      business: {
        id: BUSINESS_ID,
      },
      fileImport: {
        fileUrl: 'http://some-file.url',
        overwriteExistent: false,
        uploadedImages: [
          {
            originalName: 'some_file.png',
            url: 'http://image.url/1.png',
          },
          {
            originalName: 'some_file2.png',
            url: 'http://image.url/2.png',
          },
        ],
      },
      id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      populate: mockPopulate,
    };

    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.emitFileImportTriggeredEvent(synchronizationTaskMock as SynchronizationTaskModel);
  }
}

const mockPopulate: any = (): any => {
  return {
    execPopulate: (): void => {
      return null;
    },
    populate: mockPopulate,
  }
};