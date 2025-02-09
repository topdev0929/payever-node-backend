import { Injectable } from '@nestjs/common';
import { Command } from '@pe/nest-kit';
import { TerminalService } from '../services';

@Injectable()
export class ForceInstallDefaultThemeCommand {
  constructor(
    private readonly terminalService: TerminalService,
  ) { }

  @Command({
    command: 'reset:force:install:milestone',
    describe: 'force install default theme',
  })
  public async resetForceInstall(): Promise<void> {
    await this.terminalService.resetForceInstall();
  }
}
