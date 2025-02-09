import { Injectable } from '@nestjs/common';
import { Command, Positional, RabbitMqClient } from '@pe/nest-kit';
import { EventApplicationProducer, TerminalRabbitEventsProducer } from '../producers';
import { TerminalModel } from '../models';
import { TerminalService } from '../services';
import { BusinessModel } from '../../business/models';

@Injectable()
export class DeleteInactiveTerminalCommand {
  constructor(
    private readonly rabbitClient: RabbitMqClient,
    private readonly terminalService: TerminalService,
    private readonly terminalEventsProducer: TerminalRabbitEventsProducer,
    private readonly eventApplicationProducer: EventApplicationProducer,
  ) { }

  @Command({
    command: 'delete:inactive:terminal',
    describe: 'delete inactive terminal',
  })
  public async deleteInactiveTerminal(
    @Positional({
      name: 'businessId',
    }) businessId: string,
    @Positional({
      name: 'terminalId',
    }) terminalId: string,
  ): Promise<void> {
    if (businessId) {
      const terminals: TerminalModel[] = await this.terminalService.findInactiveByBusinessId(businessId);
      for (const terminal of terminals) {
        await this.deleteTerminal(terminal.business, terminal);
      }
    } else if (terminalId) {
      const terminal: TerminalModel = await this.terminalService.findOneById(terminalId);
      await terminal.populate('business').execPopulate();
      await this.deleteTerminal(terminal.business, terminal);
    } else {
      while (true) {
        const terminals: TerminalModel[] = await this.terminalService.findInactive();
        if (terminals.length === 0) {
          break;
        }

        for (const terminal of terminals) {
          await this.deleteTerminal(terminal.business, terminal);
        }
      }
    }
  }

  private async deleteTerminal(business: BusinessModel, terminal: TerminalModel): Promise<void> {
    const removed: boolean = await this.terminalService.removeInBusiness(business, terminal, true);
    if (removed) {
      await this.terminalEventsProducer.terminalRemoved(business, terminal);
      await this.eventApplicationProducer.produceApplicationRemovedEvent(terminal);
    }
  }
}
