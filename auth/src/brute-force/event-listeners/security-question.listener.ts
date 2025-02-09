import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { SECURITY_QUESTION_EVENT } from '../../security-question/constants';
import { SecurityQuestionService, SuspiciousActivityService } from '../services';
import { IpAddressEncoder } from '../../users/tools';
import { User } from '../../users';
import { SecurityQuestionEvent } from '../../security-question/interfaces';
import { SECURITY_QUESTION_BAN } from '../constants/ban-reasons';

@Injectable()
export class SecurityQuestionListener {
  constructor(
    private readonly bruteForceService: SuspiciousActivityService,
    private readonly securityQuestionService: SecurityQuestionService,
  ) {
  }

  @EventListener({
    eventName: SECURITY_QUESTION_EVENT,
    priority: 90,
  })
  public async logAttempt(data: SecurityQuestionEvent): Promise<void> {
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);
    await this.securityQuestionService.logAttempt(userId, hashedIpAddress, data.isValidAnswer);
  }

  @EventListener({
    eventName: SECURITY_QUESTION_EVENT,
    priority: 70,
  })
  public async onSecurityQuestionEvent(data: SecurityQuestionEvent): Promise<void> {
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);
    const banCount: number = await this.bruteForceService.checkSecurityQuestionSuspiciousActivity(
      userId,
      hashedIpAddress,
    );

    if (banCount > 0) {
      throw new UnauthorizedException(SECURITY_QUESTION_BAN);
    }
  }

  private getUserData(data: SecurityQuestionEvent): { userId: string; userEmail: string } {
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
