import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { TerminalRabbitEventsProducer } from '../producers';
import { TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { TerminalModel } from '../models';
import { environment } from '../../environments';
import { TerminalAccessConfigService } from '../services/terminal-access-config.service';
import { TerminalAccessConfigModel } from '../models/terminal-access-config.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TerminalExportCommand {
  constructor(
    @InjectModel(TerminalSchemaName)
    private readonly terminalModel: Model<TerminalModel>,
    private readonly terminalRabbitEventsProducer: TerminalRabbitEventsProducer,
    private readonly terminalAccessConfigService: TerminalAccessConfigService,
  ) { }

  @Command({
    command: 'terminal:export [--uuid] [--after]',
    describe: 'Export terminals through the bus',
  })
  public async terminalExport(
    @Option({
      name: 'uuid',
    }) terminalId?: string,
    @Option({
      name: 'after',
    }) after?: string,
  ): Promise<void> {
    const criteria: any = { };
    if (terminalId) {
      criteria._id = terminalId;
    }
    if (after) {
      criteria.createdAt = { };
      criteria.createdAt.$gte = new Date(after);
    }

    const count: number = await this.terminalModel.countDocuments(criteria);
    const limit: number = 100;
    let start: number = 0;
    let terminals: TerminalModel[] = [];

    while (start < count) {
      terminals = await this.getWithLimit(criteria, start, limit);
      start += limit;

      for (const terminal of terminals) {
        const terminalAccessConfigModel: TerminalAccessConfigModel
          = await this.terminalAccessConfigService.findByTerminal(terminal);

        let domain: string;
        if (terminalAccessConfigModel?.internalDomain) {
          domain = `${terminalAccessConfigModel.internalDomain}.${environment.posDomain}`;
        } else {
          const postfix: string = this.generatePostfix();
          domain = `${terminal.name}-${postfix}.${environment.posDomain}`;
        }

        await this.terminalRabbitEventsProducer.exportTerminal(terminal, domain);
      }
    }
  }

  private generatePostfix(): string {
    return uuid().substring(0, 4);
  }

  private async getWithLimit(
    query: { },
    start: number,
    limit: number,
  ): Promise<TerminalModel[]> {
    return this.terminalModel.find(query, null, {
      limit: limit,
      skip: start,
      sort: { createdAt: 1 },
    });
  }
}
