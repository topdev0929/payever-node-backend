import { Injectable } from '@nestjs/common';
import { BusinessEventsEnum } from '../enums';
import { BusinessModel, UserModel } from '../models';
import { EventListener } from '@pe/nest-kit';
import { BusinessEventsProducer } from '../producers';
import { UserService } from '../services';

@Injectable()
export class SendBusinessCreatedRabbitMessageListener {
  constructor(
    private readonly businessEventsProducer: BusinessEventsProducer,
    private readonly userService: UserService,
  ) { }

  @EventListener(BusinessEventsEnum.BusinessCreated)
  public async sendBusinessCreatedRabbitMessage(business: BusinessModel): Promise<void> {
    const user: UserModel = await this.userService.findById(business.owner as string);

    await this.businessEventsProducer.produceBusinessCreatedEvent(user, business);
  }
}
