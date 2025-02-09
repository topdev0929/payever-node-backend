import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { CommandService } from '../services';

@Injectable()
export class MigrateSaleCommand {
  constructor(
    private readonly commandService: CommandService,
  ) { }

  @Command({ command: 'migrate:sale', describe: 'Migrate Sale' })
  public async checkAssignedMedia(): Promise<void> {
    await this.commandService.migrateSale();
  }
}
