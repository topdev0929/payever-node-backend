import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EventDispatcher, UserTokenInterface } from '@pe/nest-kit';
import { UpdateUserAccountDto, AdminUserListDto } from '../dto';
import { UserEventsEnum } from '../enums';
import { UserAccountInterface } from '../interfaces';
import { UserAccountModel, UserModel } from '../models';
import { UserSchemaName } from '../schemas';
import { UserEventsProducer } from '../producers';
import { EmployeeService } from '../../employees/services/employee.service';
import { Employee } from '../../employees/interfaces';
import { UpdateEmployeeDto } from '../../employees/dto';
import { toPlainObject } from 'lodash';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    private userEventsProducer: UserEventsProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly employeeService: EmployeeService,
  ) { }

  public async createUserAccount(
    userId: string,
    createUserAccountDto: UserAccountInterface,
  ): Promise<UserModel> {
    let user: UserModel = await this.findById(userId);
    if (!user) {
      const employee: Employee = await this.employeeService.findOneBy({
        email: createUserAccountDto.email,
      });
      if (!!employee) {
        await this.employeeService.updateEmployee(employee, { userId } as UpdateEmployeeDto);
        createUserAccountDto.language = employee.language ? employee.language : createUserAccountDto.language;
      }
      user = await this.userModel.create(
        {
          _id: userId,
          createdAt: (createUserAccountDto as any).createdAt,
          registrationOrigin: createUserAccountDto.registrationOrigin,
          userAccount: createUserAccountDto,
        } as UserModel,
      );

      await this.userEventsProducer.produceUserCreatedEvent(user);

      await this.eventDispatcher.dispatch(UserEventsEnum.UserCreated, user);
    }

    return user;
  }

  public async findOneByUserToken(userToken: UserTokenInterface): Promise<UserModel> {
    return this.findById(userToken.id);
  }

  public async updateUserAccount(user: UserModel, newValue: UpdateUserAccountDto): Promise<void> {
    // Here Object.assign also transforms mongoose obj into JSON
    const newData: UserAccountModel = Object.assign(
      (user.userAccount || { }),
      toPlainObject(newValue),
    );

    const originalUser: UserModel = await this.userModel.findOne({ _id: user.id }).exec();

    await this.userModel.updateOne(
      { _id: user.id },
      {
        $set: {
          userAccount: newData,
        },
      },
    ).exec();

    const userUpdated: UserModel = await this.findById(user.id);

    await this.userEventsProducer.produceUserUpdatedEvent(userUpdated);

    await this.eventDispatcher.dispatch(UserEventsEnum.UserUpdated, originalUser, userUpdated);
  }

  public async remove(user: UserModel): Promise<UserModel> {
    const removedUser: UserModel = await user.remove();
    const employee: Employee = await this.employeeService.findOneBy({ email: removedUser.userAccount.email });
    await this.employeeService.deleteEmployee(employee, false);
    await this.userEventsProducer.produceUserRemovedEvent(removedUser);

    return removedUser;
  }

  public async getList(query: any, limit: number, skip: number): Promise<UserModel[]> {
    return this.userModel.find(query).limit(limit).skip(skip);
  }

  public async setBusinessRegistrationFinished(user: UserModel, language: string): Promise<UserModel> {
    return this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $set: {
          'userAccount.hasUnfinishedBusinessRegistration': false,
          'userAccount.language': language,
        },
      },
    );
  }

  public async findById(userId: string): Promise<UserModel> {
    return this.userModel.findById(userId);
  }

  public async findByEmail(email: string): Promise<UserModel> {
    return this.userModel.findOne({ 'userAccount.email': email });
  }

  public async pullBusinessFromUser(userId: string, businessId: string): Promise<void> {
    await this.userModel.updateMany({ _id: userId }, { $pull: { businesses: businessId } as never });
  }

  public async retrieveListForAdmin(query: AdminUserListDto): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    if (query.businessIds) {
      conditions.businesses = { $in: query.businessIds };
    }

    const users: UserModel[] = await this.userModel
      .find(conditions)
      .select(conditions.projection)
      .sort({ createdAt: 1 })
      .skip(offset)
      .limit(limit);

    const total: number = await this.userModel.count();

    return {
      page,
      total,
      users,
    };
  }

  public async getUsersIdsByCondition(condition: any): Promise<string[]> {
    return this.userModel.distinct('_id', condition);
  }

  public async getUsersByCondition(condition: any): Promise<UserModel[]> {
    return this.userModel.find(condition);
  }
}
