import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Query, FilterQuery } from 'mongoose';
import { MongooseModel } from '../../common';

import { UserDto } from '../dto';
import { UserModel } from '../models';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(MongooseModel.User) private readonly userModel: Model<UserModel>,
  ) { }

  public async create(createUserDto: UserDto): Promise<UserModel> {
    const user: any = {
      _id: createUserDto._id,
      createdAt: createUserDto.createdAt,
      currency: createUserDto.currency,
    };
    await this.userModel.create(user);

    return this.userModel.findOne({ _id: createUserDto._id });
  }

  public find(filter: FilterQuery<UserModel>): Query<UserModel[], UserModel, { }, UserModel> {
    return this.userModel.find(filter);
  }

  public async findOneById(userUuid: string): Promise<UserModel> {
    return this.userModel.findOne({ _id: userUuid });
  }

  public async deleteOneById(userId: string): Promise<void> {
    await this.userModel.deleteOne({ _id: userId }).exec();
  }

  public async deleteMany(filter: FilterQuery<UserModel>): Promise<void> {
    await this.userModel.deleteMany(filter);
  }

  public async updateById(userId: string, data: UserDto): Promise<void> {
    const updatedData: any = { };
    Object.keys(data).forEach((key: string) => {
      updatedData[`${key}`] = data[key];
    });

    await this.userModel.update(
      { _id: userId },
      { $set: updatedData },
    ).exec();
  }
}
