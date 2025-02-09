import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { LoginEvent } from '../../auth/interfaces';
import { LOGIN_EVENT } from '../../auth/constants';
import { SuspiciousActivityService } from '../services';
import { InjectModel } from '@nestjs/mongoose';
import { LoginAttemptSchemaName } from '../schemas';
import { LoginAttemptModel } from '../models';
import { BlockedException, CaptchaException } from '../exceptions';
import { getReasonFromBanCount } from '../enums/ban-reasons';
import { IpAddressEncoder } from '../../users/tools';
import { Employee } from '../../employees/interfaces';
import { User } from '../../users';

@Injectable()
export class LoginListener {
  constructor(
    private readonly bruteForceService: SuspiciousActivityService,
    @InjectModel(LoginAttemptSchemaName) private readonly loginAttemptModel: LoginAttemptModel,
  ) {
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 90,
  })
  public async logAttempt(data: LoginEvent): Promise<void> {
    const { userId, userEmail }: any = this.getUserData(data);
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);
    await this.loginAttemptModel.logAttempt(userId, hashedIpAddress, data.isValidPassword);
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 70,
  })
  public async onLoginEvent(data: LoginEvent): Promise<void> {
    if (!data.user) {
      return ;
    }
    const { userId, userEmail, isEmployee }: any = this.getUserData(data);
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);
    const banCount: number = await this.bruteForceService.checkLoginSuspiciousActivity(
      userId,
      userEmail,
      isEmployee,
      hashedIpAddress,
    );

    if (banCount === 1 && !data.isValidPassword) {
      throw new CaptchaException();
    }
    if (banCount > 1) {
      throw new BlockedException(getReasonFromBanCount(banCount));
    }
  }

  private getUserData(data: LoginEvent): { userId: string; userEmail: string; isEmployee: boolean } {
    let userId: string = null;
    let userEmail: string = null;
    const isEmployee: boolean = !!data.user;

    const user: User | Employee = data.user || data.employee;

    if (user) {
      userId = user._id;
      userEmail = user.email;
    }

    return { userId, userEmail, isEmployee };

  }
}
