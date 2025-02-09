import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@pe/cron-kit';
import * as moment from 'moment';
import { UserService } from '../services';
import { MailerEventProducer } from '../producer';

@Injectable()
export class SendRevokeEmailsCron {

  constructor(
    private readonly userService: UserService,
    private readonly mailerEventProducer: MailerEventProducer,
    private readonly logger: Logger,
  ) {
  }

  @Cron(`0 0 * * 0`)
  public async sendRevokeEmails(): Promise<void> {
    this.logger.log('Send Revoke Emails Cron called');

    const sixMonthsAgo = moment().subtract(6, 'months').toDate();
    const revokeDateAt = moment().add(1, 'months').toDate();
    const BATCH_SIZE = 100;

    const revokeUsers = await this.userService.getInactiveUsersWithoutReminder(sixMonthsAgo, BATCH_SIZE);

    this.logger.log(`Found ${revokeUsers.length} users to send revoke email`);

    for (const user of revokeUsers) {
      await this.mailerEventProducer.produceRevokeUserEmailMessage(user, user.email);
      await this.userService.setRevokeAccountDate(user.id, revokeDateAt );
    }
  }
}
