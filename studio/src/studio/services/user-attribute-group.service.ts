import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminBaseQueryDto, PaginationDto, UserAttributeGroupDto } from '../dto';
import { PaginationHelper } from '../helpers';
import { PaginationInterface, UserAttributeGroupInterface } from '../interfaces';
import { UserAttributeGroupModel, UserAttributeModel } from '../models';
import { UserAttributeGroupSchemaName, UserAttributeSchemaName } from '../schemas';

@Injectable()
export class UserAttributeGroupService {
  constructor(
    @InjectModel(UserAttributeGroupSchemaName) private readonly userAttributeGroupModel: Model<UserAttributeGroupModel>,
    @InjectModel(UserAttributeSchemaName) private readonly userAttributeModel: Model<UserAttributeModel>,
  ) { }

  public async getForAdmin(query: AdminBaseQueryDto)
    : Promise<{ documents: UserAttributeGroupModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    const documents: UserAttributeGroupModel[] = await this.userAttributeGroupModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.userAttributeGroupModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async create(
    dto: UserAttributeGroupDto,
  ): Promise<UserAttributeGroupModel> {
    const set: UserAttributeGroupInterface = {
      businessId: dto.businessId,
      name: dto.name,
    };
    let attributeGroup: UserAttributeGroupModel;

    try {
      attributeGroup = await this.userAttributeGroupModel.create(set);
    } catch (err) {
      if (err.name !== 'MongoError' || err.code !== 11000) {
        throw err;
      }
      attributeGroup = await this.userAttributeGroupModel.findOne(
        {
          businessId: dto.businessId,
          name: dto.name,
        },
      ).exec();
    }

    return attributeGroup;
  }

  public async update(
    attributeId: string,
    dto: UserAttributeGroupDto,
  ): Promise<UserAttributeGroupModel> {
    const set: UserAttributeGroupInterface = {
      businessId: dto.businessId,
      ...dto,
    };

    return  this.userAttributeGroupModel.findOneAndUpdate(
      { _id: attributeId },
      set,
      { new: true },
    );
  }

  public async findAll(
    businessId: string,
    pagination: PaginationDto,
  ): Promise<UserAttributeGroupModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);

    return this.userAttributeGroupModel.find({
      businessId: businessId,
    })
    .sort({ updatedAt: -1 })
    .skip(page.skip).limit(page.limit);
  }

  public async findByBusinessAndId(
    businessId: string,
    userAttributeGroupId: string,
  ): Promise<UserAttributeGroupModel> {
    return this.userAttributeGroupModel.findOne({
      _id: userAttributeGroupId,
      businessId: businessId,
    });
  }

  public async remove(
    attributeGroupModel: UserAttributeGroupModel,
  ): Promise<void> {
    await this.userAttributeModel.updateMany(
      {
        userAttributeGroup: attributeGroupModel.id,
      },
      { $unset: { userAttributeGroup: '' } },
    ).exec();

    await this.userAttributeGroupModel.deleteOne({ _id: attributeGroupModel._id }).exec();
  }

  public async findByIdsAndBusiness(
    ids: string[],
    businessId: string,
  ): Promise<UserAttributeGroupModel[]> {

    return this.userAttributeGroupModel.find({
      _id: { $in : ids },
      businessId: businessId,
    });
  }
}
