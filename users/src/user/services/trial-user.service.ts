import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { BusinessService } from './business.service';
import { UserModel } from '../models';
import * as moment from 'moment';

@Injectable()
export class TrialUserService {
  constructor(
    private readonly userService: UserService,
    private readonly businessService: BusinessService
  ) {}

  public async removeTrialUsers(olderThanDays: number): Promise<void> {
    const users: UserModel[] = await this.userService.getUsersByCondition({
      'registrationOrigin.source': 'trial',
      'userAccount.createdAt': {
        $lt: moment().subtract(olderThanDays, 'days'),
      },
    });

    for (const user of users) {
      await this.userService.remove(user);
      await this.businessService.removeBusinessesForOwner(user);
    }
  }
}
