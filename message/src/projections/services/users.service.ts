import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, DocumentDefinition, FilterQuery, UpdateQuery, Query } from 'mongoose';
import { UserDocument } from '../models';
import { UserSchemaName } from '../schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserSchemaName)
    private readonly usersModel: Model<UserDocument>,
  ) { }

  public async create(
    data: DocumentDefinition<UserDocument>,
  ): Promise<UserDocument> {
    return this.usersModel.create(data);
  }

  public findOne(filter: FilterQuery<UserDocument>): Query<UserDocument, UserDocument> {
    return this.usersModel.findOne(filter);
  }

  public find(filter: FilterQuery<UserDocument>): Query<UserDocument[], UserDocument> {
    return this.usersModel.find(filter);
  }

  public async findById(_id: string): Promise<UserDocument> {
    return this.usersModel.findById(_id);
  }

  public async update(
    data: UpdateQuery<UserDocument> & { _id: string },
    allowUpsert: boolean = false,
  ): Promise<UserDocument> {
    return this.usersModel.findByIdAndUpdate(
      data._id,
      data,
      {
        new: true,
        upsert: allowUpsert,
      },
    ).exec();
  }

  public async remove(_id: string): Promise<UserDocument> {
    return this.usersModel.findByIdAndRemove(_id);
  }

  public async deleteMany(filter: FilterQuery<UserDocument>): Promise<void> {
    await this.usersModel.deleteMany(filter);
  }
}
