import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AdminUserAttributeQueryDto, AttributeFilterDto, PaginationDto, UserAttributeDto } from '../dto';
import { PaginationHelper } from '../helpers';
import {
  MediaAttributeInterface,
  PaginationInterface,
  UserAttributeInterface,
  UserMediaAttributeInterface,
} from '../interfaces';
import { AttributeModel, UserAlbumModel, UserAttributeGroupModel, UserAttributeModel, UserMediaModel } from '../models';
import { UserAlbumSchemaName, UserAttributeSchemaName, UserMediaSchemaName } from '../schemas';
import { UserAttributeGroupService } from './user-attribute-group.service';
import { ShowOnEnum } from '../enums';
import { BusinessModel } from '../../business/models';

@Injectable()
export class UserAttributeService {
  constructor(
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(UserAlbumSchemaName) private readonly userAlbumModel: Model<UserAlbumModel>,
    @InjectModel(UserAttributeSchemaName) private readonly userAttributeModel: Model<UserAttributeModel>,
    private userAttributeGroupService : UserAttributeGroupService,
  ) { }

  public async getForAdmin(query: AdminUserAttributeQueryDto)
    : Promise<{ documents: UserAttributeModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    if (query.type) {
      conditions.type = query.type;
    }

    const documents: UserAttributeModel[] = await this.userAttributeModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.userAttributeModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async create(
    dto: UserAttributeDto,
  ): Promise<UserAttributeModel> {
    dto.filterAble = dto.filterAble ? dto.filterAble : true;
    dto.onlyAdmin = dto.onlyAdmin ? dto.onlyAdmin : false;
    dto.showOn = dto.showOn ? dto.showOn : ShowOnEnum.ALL;

    if (dto.userAttributeGroupId) {
      const userAttributeGroup: UserAttributeGroupModel =
        await this.userAttributeGroupService.findByBusinessAndId(dto.businessId, dto.userAttributeGroupId);
      dto.userAttributeGroupId = userAttributeGroup ? dto.userAttributeGroupId : undefined;
    }

    const set: UserAttributeInterface = {
      businessId: dto.businessId,
      userAttributeGroup: dto.userAttributeGroupId,
      ...dto,
    };
    let attribute: UserAttributeModel;

    try {
      attribute = await this.userAttributeModel.create(set);
    } catch (err) {
      if (err.name !== 'MongoError' || err.code !== 11000) {
        throw err;
      }
      attribute = await this.userAttributeModel.findOne(
        {
          businessId: dto.businessId,
          name: dto.name,
          type: dto.type,
        },
      ).exec();
    }

    return attribute.populate('userAttributeGroup').execPopulate();
  }

  public async update(
    attributeId: string,
    dto: UserAttributeDto,
  ): Promise<UserAttributeModel> {
    if (dto.userAttributeGroupId) {
      const userAttributeGroup: UserAttributeGroupModel =
        await this.userAttributeGroupService.findByBusinessAndId(dto.businessId, dto.userAttributeGroupId);
      dto.userAttributeGroupId = userAttributeGroup ? dto.userAttributeGroupId : undefined;
    }

    const set: UserAttributeInterface = {
      businessId: dto.businessId,
      userAttributeGroup: dto.userAttributeGroupId,
      ...dto,
    };

    return  this.userAttributeModel.findOneAndUpdate(
      { _id: attributeId },
      set,
      { new: true },
    );
  }

  public async findAll(
    businessId: string,
    pagination: PaginationDto,
  ): Promise<UserAttributeModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return this.userAttributeModel.find({
      businessId: businessId,
    })
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async findAllByType(
    businessId: string,
    type: string,
    pagination: PaginationDto,
  ): Promise<AttributeModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return this.userAttributeModel.find(
      {
        businessId: businessId,
        type: type,
      },
    )
      .sort(sort)
      .skip(page.skip).limit(page.limit);
  }

  public async findType(
    businessId: string,
  ): Promise<string[]> {
    const types: any[] = await this.userAttributeModel.aggregate(
      [
        { $match : { businessId: businessId } },
        {
          $group: {
            _id: '$type',
          },
        },
      ],
    ).exec();

    const result: string[] = [];
    types.forEach((type: any) => {
      result.push(type._id);
    });

    return result;
  }

  public async remove(
    attributeModel: UserAttributeModel,
  ): Promise<void> {
    await this.userMediaModel.updateMany(
      { },
      { $pull: { userAttributes: { attribute: attributeModel.id } } },
    ).exec();
    await this.userAlbumModel.updateMany(
      { },
      { $pull: { userAttributes: { attribute: attributeModel.id } } },
    ).exec();
    await this.userAttributeModel.deleteOne({ _id: attributeModel._id }).exec();
  }

  public async findByIdAndBusiness(
    id: string,
    businessId: string,
  ): Promise<UserAttributeModel> {

    return this.userAttributeModel.findOne({
      _id: id,
      businessId: businessId,
    });
  }

  public async findByIdsAndBusiness(
    ids: string[],
    businessId: string,
  ): Promise<UserAttributeModel[]> {

    return this.userAttributeModel.find({
      _id: { $in : ids },
      businessId: businessId,
    });
  }

  public async generateUserAttributeByGroup(
    businessId: string,
    groupIds: string[],
  ): Promise<UserMediaAttributeInterface[]> {
    const attributeByGroups: UserMediaAttributeInterface[] = [];
    const userAttributeModels: UserAttributeModel[]
      = await this.
    findByGroupIdsAndBusiness(groupIds, businessId);

    for (const userAttributeModel of userAttributeModels) {
      attributeByGroups.push(
        {
          attribute: userAttributeModel.id,
          value: userAttributeModel.defaultValue,
        },
      );
    }

    return attributeByGroups;
  }

  public async findNonOnlyAdminByIdsAndBusiness(
    groupIds: string[],
    businessId: string,
  ): Promise<UserAttributeModel[]> {

    return this.userAttributeModel.find(
      {
        _id: { $in : groupIds },
        businessId: businessId,
        onlyAdmin: false,
      },
    ).select('_id');
  }

  public async findByNameAndBusiness(
    name: string,
    businessId: string,
  ): Promise<UserAttributeModel[]> {
    return this.userAttributeModel.find(
      {
        business: businessId,
        name: name,
      },
    );
  }

  public async filterAttributeByFilterAbleOnly(
    business: BusinessModel,
    userAttributeFilter: AttributeFilterDto,
  ): Promise<AttributeFilterDto> {
    const groupIds: string[] = [];
    for (const attribute of userAttributeFilter.attributes) {
      groupIds.push(attribute.attribute);
    }

    const nonFilterAbleAttribute: AttributeModel[] =
      await this.findNonFilterAbleByIdsAndBusiness(groupIds, business.id);

    const filterableUserAttributeFilter: MediaAttributeInterface[] =
      userAttributeFilter.attributes.filter((attribute: MediaAttributeInterface) => {
        return nonFilterAbleAttribute.map((e: AttributeModel) => e.id).indexOf(attribute.attribute) === -1;
      });

    return {
      attributes: filterableUserAttributeFilter,
    };
  }

  public async filterAttributeByNonOnlyAdmin(
    businessId: string,
    userAttributes: UserMediaAttributeInterface[],
  ): Promise<UserMediaAttributeInterface[]> {
    const groupIds: string[] = [];
    for (const attribute of userAttributes) {
      groupIds.push(attribute.attribute);
    }

    const nonFilterAbleAttribute: AttributeModel[] =
      await this.findNonFilterAbleByIdsAndBusiness(groupIds, businessId);

    return userAttributes.filter((attribute: MediaAttributeInterface) => {
      return nonFilterAbleAttribute.map((e: AttributeModel) => e.id).indexOf(attribute.attribute) === -1;
    });
  }

  private async findByGroupIdsAndBusiness(
    groupIds: string[],
    businessId: string,
  ): Promise<UserAttributeModel[]> {

    return this.userAttributeModel.find(
      {
        businessId: businessId,
        userAttributeGroup: { $in : groupIds },
      },
    );
  }

  private async findNonFilterAbleByIdsAndBusiness(
    groupIds: string[],
    businessId: string,
  ): Promise<UserAttributeModel[]> {

    return this.userAttributeModel.find(
      {
        _id: { $in : groupIds },
        businessId: businessId,
        filterAble: false,
      },
    ).select('_id');
  }
}
