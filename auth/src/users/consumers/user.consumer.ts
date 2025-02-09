import { MessagePattern } from '@nestjs/microservices';
import { Controller } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../../users/interfaces';
import { EmployeeSchemaName } from '../../employees/schemas';
import { Employee, EmployeeSyncNameInterface } from '../../employees/interfaces';
import { BusinessService } from '@pe/business-kit';
import { BusinessLocalDocument } from '../../business/schemas';
import { PermissionModel } from '../../users/models';
import { PermissionSchemaName, UserSchemaName } from '../schemas';
import { UserRabbitMessagesEnum } from '../enums';
import { MessageBusChannelsEnum, RabbitMessagesEnum } from '../../common';
import { UserService } from '../services';

@Controller()
export class UserConsumer {
  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<User>,
    private readonly businessService: BusinessService<BusinessLocalDocument>,
    @InjectModel(EmployeeSchemaName) private readonly employeeModel: Model<Employee>,
    @InjectModel(PermissionSchemaName) private readonly permissionModel: Model<PermissionModel>,
    private readonly userService: UserService,
  ) { }

  @MessagePattern({
    channel: MessageBusChannelsEnum.auth,
    name: RabbitMessagesEnum.EmployeeNamesSynchronized,
  })
  public async onEmployeeNamesSynchronized(
    payload: EmployeeSyncNameInterface,
  ): Promise<void> {
    const user: User = await this.userService.findOneBy({ _id: payload.userId });
    user.firstName = payload.firstName;
    user.lastName = payload.lastName;
    await user.save();
  }

  @MessagePattern({ name: UserRabbitMessagesEnum.FixDifference })
  public async fixUserDifference(payload: { users: string[] }): Promise<any> {

    const users: string[] = payload.users;
    const authUsers: User[] = await this.userModel.find({ }, { _id: true });
    const authUserIds: string[] = authUsers.map(user => user._id);
    const usersToDelete: string[] = authUserIds.filter((userId: string) => !users.includes(userId));

    await this.userModel.deleteMany({ _id: { $in: usersToDelete } });
    await this.businessService.businessModel.deleteMany({ owner: { $in: usersToDelete } });
    await this.employeeModel.deleteMany({ userId: { $in: usersToDelete } });
    await this.permissionModel.deleteMany({ userId: { $in: usersToDelete } });
  }

}

