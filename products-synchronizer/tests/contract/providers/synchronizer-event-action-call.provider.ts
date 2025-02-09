import { Injectable } from '@nestjs/common';
import { PactRabbitMqMessageProvider, AbstractMessageMock } from '@pe/pact-kit';
import { InnerEventProducer } from '../../../src/synchronizer/producers';
import { SynchronizationModel, SynchronizationTaskModel } from '@pe/synchronizer-kit';
import { ThirdPartyActionEnum } from '../../../src/synchronizer/enums';

const BUSINESS_ID: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';

@Injectable()
export class SynchronizerEventActionCallProvider extends AbstractMessageMock {
  @PactRabbitMqMessageProvider('synchronizer.event.action.call')
  public async mockActionCall(): Promise<void> {

    const synchronizationMock: SynchronizationModel = {
      business: {
        id: BUSINESS_ID,
      },
      integration: {
        name: 'test_integration',
      },
      populate: mockPopulate,
    } as SynchronizationModel;

    const producer: InnerEventProducer = await this.getProvider<InnerEventProducer>(InnerEventProducer);
    await producer.callIntegrationAction(
      synchronizationMock,
      {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
      } as SynchronizationTaskModel,
      ThirdPartyActionEnum.SyncProducts,
      {},
    );
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
