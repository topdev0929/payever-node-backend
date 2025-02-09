import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDefinition, Model } from 'mongoose';

import { Command } from '@pe/nest-kit';
import { ElasticSearchClient } from '@pe/elastic-kit';
import { ElasticTerminalEnum } from '../enums';
import { TerminalModel } from '../models';
import { TerminalSchemaName } from '../../mongoose-schema/mongoose-schema.names';

@Injectable()
export class TerminalEsExportCommand {
  constructor(
    @InjectModel(TerminalSchemaName) private readonly terminalModel: Model<TerminalModel>,
    private readonly elasticSearchClient: ElasticSearchClient,
    private readonly logger: Logger,
  ) { }

  /* tslint:disable:cognitive-complexity */
  @Command({ command: 'terminals:es:export', describe: 'Export terminals for ElasticSearch' })
  public async export(): Promise<void> {
    let page: number = 0;
    const limit: number = 100;

    let processedTerminalsCount: number = 0;
    while (true) {
      const skip: number = page * limit;

      const terminals: TerminalModel[] =
        await this.terminalModel.find({ }).sort([['createdAt', 1]]).limit(limit).skip(skip);

      if (!terminals.length) {
        break;
      }

      const batch: Array<DocumentDefinition<TerminalModel>> = [];
      for (const terminal of terminals) {
        batch.push({
          ...terminal.toObject(),
        });
      }

      await this.elasticSearchClient.bulkIndex(
        ElasticTerminalEnum.index,
        batch,
      );

      processedTerminalsCount += terminals.length;
      page++;
    }

    this.logger.log(processedTerminalsCount + ' terminals was processed');
  }
}
