import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RabbitChannelsEnum } from '../../../../environments';
import { SpotlightInterface } from '../../../interfaces';
import { SpotlightService } from '../../../services';
import { AppEnum } from '../../../enums';
import { UserRabbitMessagesEnum } from '../enums';
import { UserAccountDto, UserDto } from '../dto';

@Controller()
export class UserMessagesConsumer {
  constructor(
    private readonly spotlightService: SpotlightService,
  ) { }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: UserRabbitMessagesEnum.UserCreated,
  })
  public async onUserCreated(data: UserDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.userAccount, data._id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: UserRabbitMessagesEnum.UserUpdated,
  })
  public async onUserUpdated(data: UserDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.userAccount, data._id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: UserRabbitMessagesEnum.UserExported,
  })
  public async onUserExport(data: UserDto): Promise<void> {
    await this.createOrUpdateSpotlightFromEvent(data.userAccount, data._id);
  }

  @MessagePattern({
    channel: RabbitChannelsEnum.Spotlight,
    name: UserRabbitMessagesEnum.UserRemoved,
  })
  public async onUserDeleted(data: UserDto): Promise<void> {
    await this.spotlightService.delete(
      data._id,
    );
  }

  private async createOrUpdateSpotlightFromEvent(data: UserAccountDto, id: string): Promise<void> {
    await this.spotlightService.createOrUpdate(
      this.userToSpotlightDocument(data, id), 
      id,
    );
  } 

  private userToSpotlightDocument(userAccount: UserAccountDto, id: string): SpotlightInterface {

    const fullName: string = `${userAccount.firstName} ${userAccount.lastName}`;

    return {
      app: AppEnum.Users,
      description: userAccount.email,
      icon: userAccount.logo,
      serviceEntityId: id,
      title: fullName,
    };
  }
}
