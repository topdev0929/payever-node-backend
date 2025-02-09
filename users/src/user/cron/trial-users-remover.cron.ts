import { Injectable } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { TrialUserService } from '../services';

@Injectable()
export class TrialUserRemoverCron {
  constructor(
    private readonly trialUserService: TrialUserService,
  ) { }

  @Cron('0 1 * * 0')
  public async removeTrialUsers(): Promise<void> {
    await this.trialUserService.removeTrialUsers(7);
  }
}

