import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '../enums';
import { BusinessModel, UserModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { UserService } from '../services';

@Injectable()
export class BusinessRegistrationFinishedListener {
  constructor(private readonly usersService: UserService ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async handleBusinessCreated(business: BusinessModel): Promise<void> {
    const owner: UserModel = await this.usersService.findById(business.owner as string);

    await this.usersService.setBusinessRegistrationFinished(owner, business.defaultLanguage);
  }
}
