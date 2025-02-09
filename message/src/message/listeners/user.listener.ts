import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { InternalEventCodesEnum } from '../../common';
import { UsersService } from '../../projections';
import { UserDocument } from '../../projections/models';
import { MerchantChatServerProducer } from '../producers';
import { ProfileDocument } from '../schemas';

@Injectable()
export class UserListener {
  constructor(
    private readonly merchantChatServerProducer: MerchantChatServerProducer,
    private readonly userService: UsersService,
  ) { }

  @EventListener(InternalEventCodesEnum.UserStatusChanged)
  public async onUserStatusChanged(
    profile: ProfileDocument,
  ): Promise<void> {
    const user: UserDocument = await this.userService.findById(profile._id);
    if (!user) {
      return;
    }
    await this.merchantChatServerProducer.userStatusUpdated(
      user,
      profile.lastSeen,
      profile.status,
    );
  }
}
