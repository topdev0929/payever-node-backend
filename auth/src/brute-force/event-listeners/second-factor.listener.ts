import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { SecurityQuestionService, SuspiciousActivityService } from '../services';
import { IpAddressEncoder } from '../../users/tools';
import { User } from '../../users';
import { SECOND_FACTOR_EVENT } from '../../2fa/constants';
import { SecondFactorEvent } from '../../2fa/interfaces';

@Injectable()
export class SecondFactorListener {
  constructor(
    private readonly bruteForceService: SuspiciousActivityService,
    private readonly securityQuestionService: SecurityQuestionService,

  ) {
  }

  @EventListener({
    eventName: SECOND_FACTOR_EVENT,
    priority: 90,
  })
  public async clearFailureAttemptsForSecurityQuestion(data: SecondFactorEvent): Promise<void> {
    if (!data.success) {
      return;
    }
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);
    await this.securityQuestionService.clearLoginFailures(userId, hashedIpAddress);
    await this.bruteForceService.removeUserFromBlockList(userId);

  }

  private getUserData(data: SecondFactorEvent): { userId: string; userEmail: string } {
    let userId: string = null;
    let userEmail: string = null;

    const user: User = data.user;

    if (user) {
      userId = user._id;
      userEmail = user.email;
    }

    return { userId, userEmail };
  }
}
