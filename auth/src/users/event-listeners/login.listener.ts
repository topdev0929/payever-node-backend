import { Injectable } from '@nestjs/common';
import { EventListener } from '@pe/nest-kit';

import { LoginEvent } from '../../auth/interfaces';
import { LOGIN_EVENT } from '../../auth/constants';
import { UserService } from '../services';
import { UserRevokedException } from '../../brute-force/exceptions';

@Injectable()
export class LoginListener {
  constructor(
    private readonly userService: UserService,
  ) {
  }

  @EventListener({
    eventName: LOGIN_EVENT,
    priority: 120,
  })
  public async onLoginEvent(loginEvent: LoginEvent): Promise<void> {
    if (loginEvent.isValidPassword && loginEvent.user) {
      if (loginEvent.user.isRevoked) {
        throw new UserRevokedException();
      } else if (loginEvent.user.revokeAccountDateAt) {
        await this.userService.setRevokeAccountDate(loginEvent.user.id, null);
      }
    }
  }
}
