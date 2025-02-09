import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import { UserService } from '../services';
import { MailerEventProducer } from '../producer';

@Injectable()
export class RevokeInactiveUsersCron {

  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {
  }

  @Cron(`0 0 * * 0`)
  private async revokeInactiveUsers(): Promise<void> {
    this.logger.log('Revoke Inactive Users Cron called');

    const revokedUserCount = await this.userService.revokeInactiveUsers();

    this.logger.log(`${revokedUserCount} users have been revoked`);
  }
}
