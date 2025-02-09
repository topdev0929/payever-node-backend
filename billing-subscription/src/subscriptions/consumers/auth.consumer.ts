import { Controller, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RedisClient, RolesEnum, UserRoleInterface, UserTokenInterface } from '@pe/nest-kit';

import { RabbitBinding, RabbitChannelsEnum } from '../../environments';
import { AuthLoginRmqMessageDto } from '../dto';
import { SubscriptionsDataExtractor } from '../services';

@Controller()
export class AuthBusMessageController {
  constructor(
    private readonly client: RedisClient,
    private readonly logger: Logger,
    private readonly subscriptionsDataExtractor: SubscriptionsDataExtractor,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.BillingSubscription,
    name: RabbitBinding.Login,
  })
  public async onLoginEvent(userModel: AuthLoginRmqMessageDto): Promise<void> {
    if (!userModel.roles.some((role: UserRoleInterface) => role.name === RolesEnum.merchant)) {
      return;
    }

    const expiration: number = 25 * 60 * 60;
    await this.client.set(
      `${userModel.id}-subscriptions`,
      await this.subscriptionsDataExtractor.getData(userModel.id),
      'EX', expiration,
    );
  }
}
