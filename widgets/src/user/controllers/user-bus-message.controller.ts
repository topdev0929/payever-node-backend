import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { WidgetInstallationService } from '../../widget/services';
import { UserDto, UserDataDto, UserAccountInterface } from '../dto';
import { UserModel } from '../models';
import { UserService } from '../services';
import { UserRabbitMessagesEnum } from '../enums';

@Controller()
export class UserBusMessageController {
  constructor(
    private readonly userService: UserService,
    private readonly widgetInstallationService: WidgetInstallationService,
  ) { }

  @MessagePattern({
    name: UserRabbitMessagesEnum.UserCreated,
  })
  public async onUserCreateEvent(data: UserDataDto): Promise<void> {
    const userData: UserAccountInterface = data.userAccount;
    userData._id = data._id;
    const createUserDto: UserDto = plainToClass(UserDto, userData as UserDto);

    await validate(createUserDto);

    const user: UserModel = await this.userService.create(createUserDto);

    await this.widgetInstallationService.installWidgetsToUser(user);
  }

  @MessagePattern({
    name: UserRabbitMessagesEnum.UserExport,
  })
  public async onUserExportEvent(data: UserDataDto): Promise<void> {
    const userData: UserAccountInterface = data.userAccount;
    userData._id = data._id;
    const migrateUserDto: UserDto = plainToClass(UserDto, userData as UserDto);

    await validate(migrateUserDto);

    if (!(await this.userService.findOneById(migrateUserDto._id))) {
      const user: UserModel = await this.userService.create(migrateUserDto);
      await this.widgetInstallationService.installWidgetsToUser(user);
    }
  }

  @MessagePattern({ 
    name: UserRabbitMessagesEnum.FixDifference,
  })
  public async fixUserDifference(payload: { users: string[] }): Promise<any> {
    const users: string[] = payload.users;
    const widgetUsers: UserModel[] = await this.userService.find({ });
    const widgetUserIds: string[] = widgetUsers.map(user => user._id);
    const usersToDelete: string[] = widgetUserIds.filter((widgetUserId) => !users.includes(widgetUserId));
    await this.userService.deleteMany({ _id: { $in: usersToDelete } });
  }
}
