import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { MessageBusChannelsEnum, UserRabbitMessagesEnum } from '../enums';
import { ImportUserFromAuthDto } from '../dto';
import { UserService } from '../services';
import { RabbitMessagesEnum } from '../../employees/enum';
import { EmployeeDetailSyncNameResultInterface } from '../../employees/interfaces';
import { UserModel } from '../models';

@Controller()
export class UserConsumer {
  constructor(
    private readonly userService: UserService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.ImportUserFromAuth,
  })
  public async onImportUserFromAuth(data: ImportUserFromAuthDto): Promise<void> {

    await this.userService.createUserAccount(data._id, {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    });
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: UserRabbitMessagesEnum.EmployeeRemovedSynced,
  })
  public async onEmployeeRemovedSynced(data: any): Promise<void> {
    await this.userService.pullBusinessFromUser(data.userId, data.businessId);
  }

  @MessagePattern({
    channel: MessageBusChannelsEnum.users,
    name: RabbitMessagesEnum.EmployeeNamesSynchronized,
  })
  public async onEmployeeNamesSynced(payload: EmployeeDetailSyncNameResultInterface): Promise<void> { 
    const userModel: UserModel = await this.userService.findById(payload.userId);
    userModel.userAccount.firstName = payload.firstName;
    userModel.userAccount.lastName = payload.lastName;
    await userModel.save();
  }
}
