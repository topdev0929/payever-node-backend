import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PermissionInterface, RolesEnum } from '@pe/nest-kit';
import { Model, FilterQuery } from 'mongoose';

import { PermissionModel } from '../models/permission.model';
import { PermissionSchemaName } from '../schemas';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(PermissionSchemaName) private readonly permissionModel: Model<PermissionModel>,
  ) { }

  public async getAll(): Promise<PermissionModel[]> {
    return this.permissionModel.find({ });
  }

  public async find(conditions: FilterQuery<PermissionModel>): Promise<PermissionModel[]> {
    return this.permissionModel.find(conditions);
  }

  public async findOneBy(conditions: FilterQuery<PermissionModel>): Promise<PermissionModel> {
    return this.permissionModel.findOne(conditions);
  }

  public async removeOne(
    businessId: string,
    userId: string,
    role: string,
  ): Promise<void> {
    await this.permissionModel.deleteOne({ businessId, userId, role });
  }

  public async removeByBusinessId(
    businessId: string,
    role: string,
  ): Promise<void> {
    await this.permissionModel.deleteMany({ businessId, role });
  }

  public async update(id: string, dto: PermissionInterface): Promise<void> {
    await this.permissionModel.updateOne(
      { _id: id },
      {
        $set: {
          ...dto,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async findOneAndUpdate(id: string, dto: PermissionInterface): Promise<PermissionModel> {
    return this.permissionModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...dto,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async updateByBusinessId(
    businessId: string,
    userId: string,
    role: string,
    dto: PermissionModel,
  ): Promise<void> {
    await this.permissionModel.updateOne(
      { businessId, userId, role },
      {
        $set: {
          ...dto,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  public async findByBusinessId(
    businessId: string,
    userId: string,
    role: string = RolesEnum.merchant,
  ): Promise<PermissionModel> {
    return this.permissionModel.findOne({ businessId, userId, role });
  }

  public async findOrCreate(businessId: string, userId: string, role: string): Promise<PermissionModel> {
    let permission: PermissionModel = await this.permissionModel.findOne(
      { businessId, userId, role },
    ).exec();

    if (!permission) {
      permission = await this.permissionModel.create(
        { businessId, userId, role },
      );
    }

    return permission;
  }
}
