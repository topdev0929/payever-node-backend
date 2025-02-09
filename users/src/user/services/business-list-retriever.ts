import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AccessTokenPayload, User } from '@pe/nest-kit';
import { Model } from 'mongoose';

import { BusinessActiveModel, BusinessModel, UserModel } from '../models';
import { BusinessActiveSchemaName, BusinessSchemaName, UserSchemaName } from '../schemas';
import { BusinessTransformer } from '../transformers/business.transformer';
import { AdminBusinessListDto, BusinessListDto } from '../dto';

@Injectable()
export class BusinessListRetriever {

  constructor(
    @InjectModel(UserSchemaName) private readonly userModel: Model<UserModel>,
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    @InjectModel(BusinessActiveSchemaName) private readonly businessActiveModel: Model<BusinessActiveModel>,
  ) { }

  public async retrieveListForAdmin(
    query: AdminBusinessListDto,
  ): Promise<any> {
    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const offset: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.active) {
      conditions.active = { $eq: query.active };
    }

    if (query.searchString) {
      conditions.$text = { $search: query.searchString };
    }

    if (query.userIds) {
      conditions.owner = { $in: query.userIds };
    }

    const businesses: BusinessModel[] = await this.businessModel
      .find(conditions)
      .select(conditions.projection)
      .sort({ name: 1 })
      .skip(offset)
      .limit(limit)
      .populate('owner');

    const total: number = await this.businessModel.count();

    return {
      businesses,
      page,
      total,
    };
  }

  public async retrieve(
    queryParams: BusinessListDto,
    @User() userTokenDto: AccessTokenPayload,
  ): Promise<any> {
    let active: BusinessActiveModel = await this.businessActiveModel.findOne(
      {
        owner: userTokenDto.id,
      },
    );

    if (!active) {
      const activeBusiness: BusinessModel[] = await this.businessModel.find({ owner: userTokenDto.id })
        .sort({ active : -1, createdAt: -1});
      if (activeBusiness.length > 0) {
        active = await this.businessActiveModel.findOneAndUpdate(
          {
            owner: userTokenDto.id,
          },
          {
            $set: {
              businessId: activeBusiness[0].id,
              owner: userTokenDto.id,
            },
          },
          {
            new: true,
            setDefaultsOnInsert: true,
            upsert: true,
          },
        );
      }
    }

    let businesses: BusinessModel[];
    let info: {
      businesses: BusinessModel[];
      total: number;
    };
    if (
      BusinessListRetriever.globalSearchAllowed(userTokenDto)
        && BusinessListRetriever.globalSearchRequested(queryParams)
    ) {
      businesses = await this.findBusinessesForAdmin(queryParams);
      info = {
        businesses,
        total: businesses.length,
      };
    } else {
      info = await this.findBusinessesForUser(queryParams, userTokenDto.id, queryParams.active, active?.businessId);
      businesses = info.businesses;
    }

    return {
      businesses: BusinessTransformer.transform(businesses, active),
      total: info.total,
    };
  }

  private async findBusinessesForUser(
    query: BusinessListDto,
    userId: string,
    active: string,
    activeBusiness: any,
  ): Promise<any> {
    const limit: number = query.limit || 20;
    const page: number = query.page || 1;
    const skip: number = (page - 1) * limit;
    const businessName: string | null = query.name;

    const additionalQuery: any = { };
    let activeBusinessesModel: BusinessModel;

    if (typeof active !== 'undefined') {
      // show active on first page only and rest will be others
      if (active === 'true') {
        if (skip === 0) {
          activeBusinessesModel = await this.businessModel.findOne(
            {
              _id: { $eq: activeBusiness },
            },
          );
        }
      } else {
        additionalQuery._id = { $ne: activeBusiness };
      }
    }
    const user: UserModel = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const conditions: any = {
      ...BusinessListRetriever.normalizeConditions(query),
      ...additionalQuery,
      ...(businessName ? { name: new RegExp(`^${businessName}.*`) } : { }),
      $or : [
        { owner: userId },
        { _id: { $in : user.businesses } },
      ],
    };

    const businesses: BusinessModel[] = await this.businessModel.find(conditions).skip(skip).limit(limit);
    const total: number = await this.businessModel.find(
      {
        ...additionalQuery,
        $or : [
          { owner: userId },
          { _id: { $in : user.businesses } },
        ],
      },
    ).count();

    return {
      businesses: activeBusinessesModel ? [activeBusinessesModel, ...businesses] : businesses,
      total,
    };
  }

  private async findBusinessesForAdmin(queryParams: any): Promise<BusinessModel[]> {
    if (BusinessListRetriever.emailSearchRequested(queryParams)) {
      queryParams.userEntities = await this.userModel.find(
        { 'userAccount.email': new RegExp(queryParams.email, 'ig') }, '_id',
      ).exec();
    }

    if (queryParams.userIds) {
      queryParams.owner = { $in: queryParams.userIds };
    }

    if (queryParams.userEntities) {
      const userIds: string[] = [];
      queryParams.userEntities.forEach((userEntity: { _id: string }) => userIds.push(userEntity._id));
      queryParams.owner = { $in: userIds };
    }

    if (queryParams.query) {
      if (queryParams.owner) {
        queryParams.$or = [
          {
            name: new RegExp(queryParams.query, 'ig'),
          },
          { owner: queryParams.owner },
        ];
        delete queryParams.owner;
      } else {
        queryParams.name = new RegExp(queryParams.query, 'ig');
      }
    }

    return this.findBusinessesForAdminInternal(queryParams);
  }

  private async findBusinessesForAdminInternal(conditions: any): Promise<BusinessModel[]> {
    const limit: number = conditions.limit || 100;
    const page: number = conditions.page || 1;
    const offset: number = (page - 1) * limit;

    const normalizedConditions: any = BusinessListRetriever.normalizeConditions(conditions);

    return this.businessModel
      .find(normalizedConditions)
      .select(conditions.projection)
      .sort({ name: 1 })
      .skip(offset)
      .limit(limit)
      .populate('owner');
  }

  private static normalizeConditions(conditions: any): any {
    delete conditions.page;
    delete conditions.limit;
    delete conditions.query;
    delete conditions.email;
    delete conditions.admin;
    delete conditions.userEntities;
    delete conditions.userIds;
    delete conditions.projection;
    delete conditions.name;

    // active is removed to other collection
    delete conditions.active;

    return conditions;
  }

  private static globalSearchAllowed(user: AccessTokenPayload): boolean {
    return user.isAdmin();
  }

  private static globalSearchRequested(queryParams: any): boolean {
    return !!queryParams.admin;
  }

  private static emailSearchRequested(queryParams: any): boolean {
    return !!queryParams.email;
  }
}
