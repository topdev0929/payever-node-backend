import { Injectable, Logger } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { TrialUserService } from '../services';

@Injectable()
export class RemoveTrialUsersCommand {
  constructor(
    private readonly trialUserService: TrialUserService,
    private readonly logger: Logger,
  ) { }

  @Command({ command: 'remove-trial-users' })
  public async removeTrialUsers(
    @Option({
      name: 'older-than-days',
    }) olderThanDays: number,
  ): Promise<void> {
    if (!olderThanDays) {
      olderThanDays = 0;
    }
    this.logger.log(`removing trail users older than ${olderThanDays} days.`);
    await this.trialUserService.removeTrialUsers(olderThanDays);
    this.logger.log(`trail users older than ${olderThanDays} days has removed.`);
  }
}
