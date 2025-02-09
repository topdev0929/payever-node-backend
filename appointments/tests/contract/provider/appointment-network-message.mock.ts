import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { AppointmentNetworkMessagesProducer } from '../../../src/appointment-network/producers';
import { AppointmentNetworkRabbitMessagesEnum } from '../../../src/appointment-network/enums';
import { AppointmentNetworkStub } from '../stub/appointment-network.stub';
import { AppointmentNetworkModel } from 'src/appointment-network/models';

@Injectable()
export class AppointmentNetworkMessageMock extends AbstractMessageMock {

  @PactRabbitMqMessageProvider(AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkCreated)
  public async mockAppointmentNetworkProduceEvent(): Promise<void> {
    const producer: AppointmentNetworkMessagesProducer = await this.getProvider<AppointmentNetworkMessagesProducer>(
      AppointmentNetworkMessagesProducer,
    );
    await producer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkCreated,
      AppointmentNetworkStub as AppointmentNetworkModel,
    );
  }

  @PactRabbitMqMessageProvider(AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkRemoved)
  public async mockAppointmentUpdated(): Promise<void> {
    const producer: AppointmentNetworkMessagesProducer = await this.getProvider<AppointmentNetworkMessagesProducer>(
      AppointmentNetworkMessagesProducer,
    );
    await producer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkRemoved,
      AppointmentNetworkStub as AppointmentNetworkModel
    );
  }

  @PactRabbitMqMessageProvider(AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkUpdated)
  public async mockAppointmentRemoved(): Promise<void> {
   const producer: AppointmentNetworkMessagesProducer = await this.getProvider<AppointmentNetworkMessagesProducer>(
      AppointmentNetworkMessagesProducer,
    );
    await producer.produceAppointmentNetworkEvent(
      AppointmentNetworkRabbitMessagesEnum.AppointmentNetworkUpdated,
      AppointmentNetworkStub as AppointmentNetworkModel
    );
  }
}
