import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { AttributeFilterDto, DuplicateUserAlbumDto, BuilderPaginationDto, UpdateUserAlbumDto, UserAlbumDto } from '../dto';
import { UserAlbumInterface, UserMediaAttributeInterface } from '../interfaces';
import { UserAlbumModel, UserAttributeModel, UserMediaModel } from '../models';
import { UserAlbumSchemaName } from '../schemas';
import { AncestorHelper, AttributeHelper } from '../helpers';
import { UserAttributeService } from './user-attribute.service';
import { CounterService } from './counter.service';
import { UserMediaService } from './user-media.service';

const userAttributeRefference: string = 'userAttributes.attribute';
const selectFields: string = 'icon name type';

@Injectable()
export class UserAlbumService {
  constructor(
    @InjectModel(UserAlbumSchemaName) private readonly userAlbumModel: Model<UserAlbumModel>,
    private readonly userAttributeService: UserAttributeService,
    private readonly userMediaService: UserMediaService,
    private readonly counterService: CounterService,
  ) { }

  public async createDefault(
    business: BusinessModel,
  ): Promise<void> {
    const query: any = {
      businessId: business._id,
      name: 'Texts',
    };

    const exist: number = await this.userAlbumModel.find(query).count();

    if (exist === 0) {
      const dto: UserAlbumDto = {
        businessId: business._id,
        name: 'Texts',
      };

      await this.create(business, dto);
    }
  }

  public async create(
    business: BusinessModel,
    dto: UserAlbumDto,
  ): Promise<UserAlbumModel> {
    const parentModel: UserAlbumModel = await this.userAlbumModel.findOne({
      _id: dto.parent,
    }).exec();

    const set: UserAlbumInterface = {
      ancestors: AncestorHelper.buildAncestors(parentModel),
      businessId: business.id,
      ...dto,
    };

    if (parentModel) {
      await this.userAlbumModel.findOneAndUpdate(
        {
          _id: dto.parent,
        },
        {
          $set: {
            hasChildren: true,
          },
        },
      ).exec();
    }

    if (dto.userAttributeGroups && dto.userAttributeGroups.length > 0) {
      let userAttributes: UserMediaAttributeInterface[]
        = await this.userAttributeService.generateUserAttributeByGroup(business.id, dto.userAttributeGroups);

      userAttributes = AttributeHelper.mergeUserAttributes(userAttributes, set.userAttributes);

      set.userAttributes = userAttributes;
    }

    const result: UserAlbumModel = await this.userAlbumModel.create(set);

    return result.populate({
      path: userAttributeRefference,
      select: selectFields,
    }).execPopulate();
  }

  public async update(
    userAlbumId: string,
    business: BusinessModel,
    dto: UpdateUserAlbumDto,
  ): Promise<UserAlbumModel> {
    const parentModel: UserAlbumModel = await this.userAlbumModel.findOne({
      _id: dto.parent,
    }).exec();

    const set: UserAlbumInterface = {
      ancestors: AncestorHelper.buildAncestors(parentModel),
      businessId: business.id,
      ...dto,
    };

    if (parentModel) {
      await this.userAlbumModel.findOneAndUpdate(
        {
          _id: dto.parent,
        },
        {
          $set: {
            hasChildren: true,
          },
        },
      ).exec();
    }

    if (dto.userAttributeGroups && dto.userAttributeGroups.length > 0) {
      const existing: UserAlbumModel = await this.userAlbumModel.findOne({
        _id: userAlbumId,
      }).exec();

      let userAttributes: UserMediaAttributeInterface[]
        = await this.userAttributeService.generateUserAttributeByGroup(business.id, dto.userAttributeGroups);

      userAttributes = AttributeHelper.mergeUserAttributes(userAttributes, existing.userAttributes);
      userAttributes = AttributeHelper.mergeUserAttributes(userAttributes, set.userAttributes);

      set.userAttributes = userAttributes;
    }

    const album: UserAlbumModel = await this.userAlbumModel.findOneAndUpdate(
      {
        _id: userAlbumId,
      },
      {
        $set: set,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: false,
      },
    ).exec();

    if (dto.parent) {
      await this.updateChildrenAncestors(album);
    }

    return album.populate({
      path: userAttributeRefference,
      select: selectFields,
    }).execPopulate();
  }

  public async remove(
    userAlbumModel: UserAlbumModel,
  ): Promise<void> {
    if (userAlbumModel.parent) {
      const hasSingleChildren: boolean =
        (await this.userAlbumModel.find({ parent: userAlbumModel.parent }).count().exec()) === 1;

      if (hasSingleChildren) {
        await this.userAlbumModel.findOneAndUpdate(
          {
            _id: userAlbumModel.parent,
          },
          {
            $set: {
              hasChildren: false,
            },
          },
        ).exec();
      }
    }

    await this.userAlbumModel.deleteOne({ ancestors: userAlbumModel.id }).exec();
    await this.userAlbumModel.deleteOne({ _id: userAlbumModel.id }).exec();
  }

  public async duplicateAlbums(
    business: BusinessModel,
    dto: DuplicateUserAlbumDto,
  ): Promise<UserAlbumModel[]> {
    if (dto.albumIds.includes(dto.parent)) {
      throw new BadRequestException(`Wrong request: cannot copy to itself`);
    }

    const parentModel: UserAlbumModel = await this.userAlbumModel.findOne(
      {
        _id: dto.parent,
        businessId: business.id,
      },
    ).exec();

    // validate parent model
    if (parentModel) {
      const intersect: string[] =
        parentModel.ancestors.filter((value: string) => dto.albumIds.includes(value));
      if (intersect.length > 0) {
        throw new BadRequestException(`Wrong request: cannot target parent from its own child`);
      }
    }

    const albumModels: UserAlbumModel[] = await this.userAlbumModel.find(
      {
        _id: { $in: dto.albumIds },
        businessId: business.id,
      },
    ).exec();

    if (albumModels.length <= 0) {
      return ;
    }

    const resultModels: UserAlbumModel[] = [];

    for (const album of albumModels) {
      const copyObj: any = album.toObject();
      delete copyObj._id;
      const nameCounter: number = await this.counterService.getNextCounter(
        business.id,
        album.name,
        'duplicate-album',
      );

      copyObj.name = album.name + `-${dto.prefix ? dto.prefix : 'copy'}-${nameCounter}`;
      copyObj.parent = parentModel ? dto.parent : null;
      copyObj.ancestors = AncestorHelper.buildAncestors(parentModel);
      const albumCopy: UserAlbumModel = await this.userAlbumModel.create(copyObj);
      resultModels.push(albumCopy);

      // process copy media inside album
      const userMediaModels: UserMediaModel[] = await this.userMediaService.getByAlbum(album.id);
      const userMediaIds: string[] = userMediaModels.map((userMediaModel: UserMediaModel) => userMediaModel._id);
      if (userMediaIds.length > 0) {
        await this.userMediaService.duplicate(
          business,
          {
            album: albumCopy.id,
            prefix: dto.prefix,
            userMediaIds: userMediaIds,
          },
        );
      }

      // process copy child
      const children: UserAlbumModel[] = await this.userAlbumModel.find(
        {
          businessId: business.id,
          parent: album.id,
        },
      ).select('_id').lean().exec() as any;

      const childIds: string[] = children.map((child: UserAlbumModel) => child._id);

      if (childIds.length > 0) {
        await this.duplicateAlbums(
          business,
          {
            albumIds: childIds,
            parent: albumCopy.id,
            prefix: dto.prefix,
          },
        );
      }
    }

    if (parentModel) {
      await this.userAlbumModel.findOneAndUpdate(
        {
          _id: dto.parent,
        },
        {
          $set: {
            hasChildren: true,
          },
        },
      ).exec();
    }

    return resultModels;
  }

  public async findById(
    albumId: string,
  ): Promise<UserAlbumModel> {
    return this.userAlbumModel.findOne({
      _id: albumId,
    }).populate({
      path: userAttributeRefference,
      select: selectFields,
    });
  }

  public async findByIdAndBusiness(
    albumId: string,
    businessId: string,
  ): Promise<UserAlbumModel> {
    return this.userAlbumModel.findOne({
      _id: albumId,
      businessId: businessId,
    });
  }

  public async findByNameAndBusiness(
    name: string,
    businessId: string,
  ): Promise<UserAlbumModel> {
    return this.userAlbumModel.findOne({
      businessId: businessId,
      name: name,
    });
  }

  public async findAllParentByBusinessId(
    business: BusinessModel,
  ): Promise<UserAlbumModel[]> {
    const query: any = {
      businessId: business.id,
      parent: null,
    };

    return this.userAlbumModel.find(query);
  }

  public async findByBusinessId(
    pagination: BuilderPaginationDto,
    business: BusinessModel,
    parent?: string,
  ): Promise<UserAlbumModel[]> {
    const query: any = {
      businessId: business.id,
    };

    if (parent) {
      query.parent = parent;
    }

    return this.userAlbumModel.find(query);
  }

  public async findByBusinessIdAndAncestor(
    pagination: BuilderPaginationDto,
    business: BusinessModel,
    ancestor: string,
  ): Promise<UserAlbumModel[]> {

    return this.userAlbumModel.find({
      ancestors: ancestor,
      businessId: business.id,
    });
  }

  public async findByUserAttribute(
    pagination: BuilderPaginationDto,
    business: BusinessModel,
    userAttributeId: string,
    userAttributeValue: string,
  ): Promise<UserAlbumModel[]> {
    const userAttribute: UserAttributeModel
      = await this.userAttributeService.findByIdAndBusiness(userAttributeId, business.id);

    if (!userAttribute || userAttribute.filterAble === false) {
      return ;
    }

    const data: UserAlbumModel[] = await this.userAlbumModel.find({
        $and: [
          { 'userAttributes.attribute': userAttributeId },
          { 'userAttributes.value': userAttributeValue },
        ],
      })
      .populate({
        match: {
          showOn: { $in: ['all', 'media'] },
        },
        path: userAttributeRefference,
        select: selectFields,
      })
      .sort({ updatedAt: -1 }).exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async findByMultipleUserAttributes(
    pagination: BuilderPaginationDto,
    business: BusinessModel,
    userAttributeFilter: AttributeFilterDto,
  ): Promise<UserAlbumModel[]> {

    userAttributeFilter
      = await this.userAttributeService.filterAttributeByFilterAbleOnly(business, userAttributeFilter);

    const filter: any[] = AttributeHelper.filterUserAttribute(userAttributeFilter);

    const data: UserAlbumModel[] = await this.userAlbumModel.find({
        $and: filter,
      })
      .populate({
        match: {
          showOn: { $in: ['all', 'media'] },
        },
        path: userAttributeRefference,
        select: selectFields,
      }).exec();

    return data.filter(AttributeHelper.filterNotNullUserAttributes);
  }

  public async createDefaultAlbum(
    businessId: string,
  ): Promise<void> {
    await this.userAlbumModel.create(
      { businessId: businessId, name: 'Photos', parent: null, ancestors: [], description: '' },
    );
    await this.userAlbumModel.create(
      { businessId: businessId, name: 'Videos', parent: null, ancestors: [], description: '' },
    );
    await this.userAlbumModel.create(
      { businessId: businessId, name: 'Scripts', parent: null, ancestors: [], description: '' },
    );
    await this.userAlbumModel.create(
      { businessId: businessId, name: '3D Models', parent: null, ancestors: [], description: '' },
    );
  }

  private async updateChildrenAncestors(parent: UserAlbumModel): Promise<void> {
    const children: UserAlbumModel[] = await this.userAlbumModel.find({
      parent: parent.id,
    }).exec();

    for (const child of children) {
      const ancestor: string[] = AncestorHelper.buildAncestors(parent);
      await this.userAlbumModel.updateOne(
        {
          _id: child.id,
        },
        {
          $set: {
            ancestors: ancestor,
          },
        },
      ).exec();
      await this.updateChildrenAncestors(child);
    }
  }
}
