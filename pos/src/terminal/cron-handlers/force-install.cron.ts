import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { TerminalService } from '../services';
import { ForceInstallTerminalProducer } from '../producers';
import { TerminalModel } from '../models';

@Injectable()
export class ForceInstallCron {

  constructor(
    private readonly terminalService: TerminalService,
    private readonly forceInstallApplicationProducer: ForceInstallTerminalProducer,
    private readonly logger: Logger,
  ) {
  }

  @Cron(`* * * * * *`)
  private async processSchedulerTask(): Promise<void> {
    this.logger.log('Force install Cron called');
    const applications: TerminalModel[] = await this.terminalService.findForceInstall();
    for (const application of applications) {
      await this.forceInstallApplicationProducer.sendTerminalForceInstall(application);
      await this.terminalService.setForceInstall(application);
    }
  }
}
