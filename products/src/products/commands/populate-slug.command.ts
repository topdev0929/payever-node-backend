import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { CommandService } from '../services';

@Injectable()
export class PopulateSlugCommand {
  constructor(
    private readonly commandService: CommandService,
  ) { }

  @Command({ command: 'populate:slug', describe: 'Populate slug' })
  public async checkAssignedMedia(): Promise<void> {
    await this.commandService.populateAllSlug();
  }
}
