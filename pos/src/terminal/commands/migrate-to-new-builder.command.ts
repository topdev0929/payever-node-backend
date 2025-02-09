import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { TerminalAccessConfigService, TerminalService } from '../services';
import { TerminalAccessConfigModel, TerminalModel } from '../models';
import { TerminalRabbitEventsProducer } from '../producers';

@Injectable()
export class MigrateThemesCommand {
  constructor(
    private readonly logger: Logger,
    private readonly terminalService: TerminalService,
    private readonly terminalAccessService: TerminalAccessConfigService,
    private readonly posMessagesProducer: TerminalRabbitEventsProducer,
  ) { }

  @Command({
    command: 'pos:migrate:new-builder',
    describe: 'Migrate pos to new builder',
  })
  public async export(): Promise<void> {
    const limit: number = 100;

    let processedCount: number = 0;
    let skip: number = 0;
    while (true) {
      const terminals: TerminalModel[] = await this.terminalService.getList({ }, limit, skip);

      if (!terminals.length) {
        break;
      }

      processedCount += terminals.length;

      for (const terminal of terminals) {
        await this.migrateTerminal(terminal);
      }


      skip += limit;
    }

    this.logger.log(processedCount + ' terminals were processed');
  }

  private async migrateTerminal(terminal: TerminalModel): Promise<void> {
    const accessConfig: TerminalAccessConfigModel = await this.terminalAccessService.findByTerminal(terminal);
    if (!accessConfig) {
      await this.terminalAccessService.create(
        terminal,
        {
          isLive: terminal.live,
          isLocked: false,
        },
      );
    }

    await this.posMessagesProducer.requestDefaultThemeEvent(terminal);
  }
}
