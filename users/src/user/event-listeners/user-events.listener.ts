import { Injectable } from '@nestjs/common';

import { EventListener } from '@pe/nest-kit';
import { UserEventsEnum } from '../enums';
import { UserModel } from '../models';
import { UserElasticService } from '../services';

@Injectable()
export class UserEventsListener {
  constructor(
    private readonly userElasticService: UserElasticService,
  ) { }

  @EventListener(UserEventsEnum.UserCreated)
  public async onUserCreated(user: UserModel): Promise<void> {
    await this.userElasticService.saveIndex(user);
  }

  @EventListener(UserEventsEnum.UserUpdated)
  public async onUserUpdated(_originalUser: UserModel, updatedUser: UserModel): Promise<void> {
    await this.userElasticService.saveIndex(updatedUser);
  }

  @EventListener(UserEventsEnum.UserRemoved)
  public async onUserRemoved(user: UserModel): Promise<void> {
    await this.userElasticService.deleteIndex(user);
  }
}
