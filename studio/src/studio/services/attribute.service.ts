import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttributeDto, PaginationDto } from '../dto';
import { PaginationHelper } from '../helpers';
import { AttributeInterface, PaginationInterface } from '../interfaces';
import { AttributeModel, SubscriptionMediaModel, UserMediaModel } from '../models';
import { AttributeSchemaName, SubscriptionMediaSchemaName, UserMediaSchemaName } from '../schemas';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(AttributeSchemaName) private readonly attributeModel: Model<AttributeModel>,
    @InjectModel(UserMediaSchemaName) private readonly userMediaModel: Model<UserMediaModel>,
    @InjectModel(SubscriptionMediaSchemaName) private readonly subscriptionMediaModel: Model<SubscriptionMediaModel>,
  ) { }

  public async create(
    dto: AttributeDto,
  ): Promise<AttributeModel> {
    const set: AttributeInterface = {
      ...dto,
    };
    let attribute: AttributeModel;

    try {
      attribute = await this.attributeModel.create(set);
    } catch (err) {
      if (err.name !== 'MongoError' || err.code !== 11000) {
        throw err;
      }
      attribute = await this.attributeModel.findOne(
        {
          name: dto.name,
        },
      ).exec();
    }

    return attribute;
  }

  public async update(
    attributeId: string,
    dto: AttributeDto,
  ): Promise<AttributeModel> {
    const set: AttributeInterface = {
      ...dto,
    };

    return  this.attributeModel.findOneAndUpdate(
      { _id: attributeId },
      set,
      { new: true },
    );
  }

  public async findByName(name: string): Promise<AttributeModel[]> {
    return this.attributeModel.find(
      {
        name,
      },
    );
  }

  public async findOneByNameAndType(
    name: string,
    type: string,
  ): Promise<AttributeModel> {
    return this.attributeModel.findOne(
      {
        name,
        type,
      },
    );
  }

  public async findAll(
    pagination: PaginationDto,
  ): Promise<AttributeModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return this.attributeModel.find()
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async findType(): Promise<string[]> {
    const types: any[] = await this.attributeModel.aggregate(
      [
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

  public async findAllByType(
    type: string,
    pagination: PaginationDto,
  ): Promise<AttributeModel[]> {
    const page: PaginationInterface = PaginationHelper.getPagination(pagination);
    const sort: any = PaginationHelper.getSortQuery(pagination);

    return this.attributeModel.find(
      {
        type: type,
      },
    )
    .sort(sort)
    .skip(page.skip).limit(page.limit);
  }

  public async remove(
    attributeModel: AttributeModel,
  ): Promise<void> {
    await this.subscriptionMediaModel.updateMany(
      { },
      { $pull: { attributes: { attribute: attributeModel.id } } },
    ).exec();
    await this.userMediaModel.updateMany(
      { },
      { $pull: { attributes: { attribute: attributeModel.id } } },
    ).exec();

    await this.attributeModel.deleteOne({ _id: attributeModel._id }).exec();
  }
}
