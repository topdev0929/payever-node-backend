import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';
import { InjectModel } from '@nestjs/mongoose';

import { RegisterEvent } from '../../users/interfaces';
import { REGISTER_EVENT } from '../../users/constants';

import { SuspiciousActivityService } from '../services';
import { RegisterAttemptSchemaName } from '../schemas';
import { RegisterAttemptModel } from '../models';
import { RegisterBlockedException, RegisterCaptchaException } from '../exceptions';
import { getRegistrationBanFromCount } from '../enums/ban-register';
import { IpAddressEncoder } from '../../users/tools';

@Injectable()
export class RegisterListener {
  constructor(
    private readonly bruteForceService: SuspiciousActivityService,
    @InjectModel(RegisterAttemptSchemaName) private readonly registerAttemptModel: RegisterAttemptModel,
  ) { }

  @EventListener(REGISTER_EVENT)
  public async onRegisterEvent(data: RegisterEvent): Promise<void> {
    if (data.bulkEventId || data.isInvitedEmployee || data.isRpc) {
      return;
    }

    const userId: string = data.user ? data.user.id : null;
    const userEmail: string = data.registerDto ? data.registerDto.email : null;
    const hashedIpAddress: string = IpAddressEncoder.encodeUsersIpAddress(data.parsedRequest.ipAddress, userEmail);

    await this.registerAttemptModel.logAttempt(userId, hashedIpAddress);

    const banCount: number = await this.bruteForceService.checkRegisterSuspiciousActivity(hashedIpAddress);

    if (banCount === 1 && !data.isValid) {
      throw new RegisterCaptchaException();
    }

    if (banCount > 1) {
      throw new RegisterBlockedException(getRegistrationBanFromCount(banCount));
    }
  }
}
