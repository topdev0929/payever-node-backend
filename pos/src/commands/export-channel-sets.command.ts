import { Injectable, Logger } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { from } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';
import { TerminalModel, TerminalRabbitEventsProducer, TerminalService } from '../terminal';

export const BATCH_SIZE: number = 50;

@Injectable()
export class ExportChannelSets {
  constructor(
    private readonly eventProducer: TerminalRabbitEventsProducer,
    private readonly terminalService: TerminalService,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'export:channelsets', describe: 'Export channelsets of terminals to products through bus' })
  public async exportShops(): Promise<void> {
    this.logger.log('Exporting channelsets started');
    await this.terminalService
      .findAll(BATCH_SIZE)
      .pipe(
        filter((model: TerminalModel) => !!(model.business)),
        filter((model: TerminalModel) => !!(model.channelSet)),
        mergeMap((model: TerminalModel) => from(this.eventProducer.exportToProduct(model)), BATCH_SIZE),
      )
      .toPromise();
    this.logger.log('Exporting channelsets finished');
  }
}
