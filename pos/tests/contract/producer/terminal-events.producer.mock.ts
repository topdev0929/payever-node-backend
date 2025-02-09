import { Injectable } from '@nestjs/common';
import { AbstractMessageMock, PactRabbitMqMessageProvider } from '@pe/pact-kit';
import { BusinessModel } from '../../../src/business';
import * as uuid from 'uuid';
import { TerminalModel, TerminalRabbitEventsProducer } from '../../../src/terminal';
import { ChannelSetModel } from '@pe/channels-sdk';

@Injectable()
export class TerminalRabbitEventMessagesMock extends AbstractMessageMock {
  private business: BusinessModel = {
    id: uuid.v4(),
  } as BusinessModel;

  private terminal: TerminalModel = {
    business: {
      id: uuid.v4(),
    } as BusinessModel,
    channelSet: {
      id: uuid.v4(),
    } as ChannelSetModel,
    id: uuid.v4(),
    name: 'Terminal name',
    logo: 'logo',
    active: true,

    populate(): any {
      return this;
    },
    execPopulate(): any {
      return this;
    },
  } as any;

  private domain: string = 'domain';

  @PactRabbitMqMessageProvider('pos.event.terminal.created')
  public async mockTerminalCreated(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.terminalCreated(this.business, this.terminal, 'example.com');
  }

  @PactRabbitMqMessageProvider('pos.event.terminal.updated')
  public async mockTerminalUpdated(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.terminalUpdated(this.business, this.terminal);
  }

  @PactRabbitMqMessageProvider('pos.event.terminal.removed')
  public async mockTerminalRemoved(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.terminalRemoved(this.business, this.terminal);
  }

  @PactRabbitMqMessageProvider('pos.event.terminal.export')
  public async mockTerminalExport(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.exportTerminal(this.terminal, this.domain);
  }

  @PactRabbitMqMessageProvider('pos.event.terminal.set_default')
  public async mockSetDefaultTerminalEvent(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.setDefaultTerminalEvent(this.business, this.terminal);
  }

  @PactRabbitMqMessageProvider('channels.event.channel-set.exported')
  public async mockExportToProduct(): Promise<void> {
    const producer: TerminalRabbitEventsProducer =
      await this.getProvider<TerminalRabbitEventsProducer>(TerminalRabbitEventsProducer);
    await producer.exportToProduct(this.terminal);
  }
}
