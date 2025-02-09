import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { ChannelSetRabbitProducer, ChannelSetModel } from '../../../src/channel-set';
import { BusinessModel } from '../../../src/business';
import * as uuid from 'uuid';
import { RabbitBinding } from '../../../src/environments';
import { CheckoutModel } from '../../../src/checkout';

@Injectable()
export class CheckoutChannelSetByBusinessMessagesMock extends AbstractMessageMock {
  private business: BusinessModel = { id: uuid.v4() } as BusinessModel;
  private channelSet: ChannelSetModel = { id: uuid.v4() } as ChannelSetModel;
  private checkout: CheckoutModel = { id: uuid.v4() } as CheckoutModel;

  @PactRabbitMqMessageProvider(RabbitBinding.CheckoutLinkedToChannelSet)
  public async mockCheckoutLinkedToChannelSet(): Promise<void> {
    const producer: ChannelSetRabbitProducer =
      await this.getProvider<ChannelSetRabbitProducer>(ChannelSetRabbitProducer);
    await producer.checkoutLinkedToChannelSet(this.checkout, this.channelSet);
  }

  @PactRabbitMqMessageProvider(RabbitBinding.ChannelSetUnlinked)
  public async mockChannelSetUnlinked(): Promise<void> {
    const producer: ChannelSetRabbitProducer =
      await this.getProvider<ChannelSetRabbitProducer>(ChannelSetRabbitProducer);
    await producer.channelSetUnlinked(this.checkout, this.channelSet);
  }

  @PactRabbitMqMessageProvider(RabbitBinding.ChannelSetByBusinessExport)
  public async mockChannelsetByBusinessExportMessage(): Promise<void> {
    const producer: ChannelSetRabbitProducer =
      await this.getProvider<ChannelSetRabbitProducer>(ChannelSetRabbitProducer);
    await producer.channelSetByBusinessExportMessage(this.business, this.channelSet);
  }
}
