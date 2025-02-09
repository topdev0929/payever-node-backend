import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FraudListSchemaName } from '../schemas';
import { Model } from 'mongoose';
import { FraudListModel } from '../models';
import { FraudListRequestDto, ItemsQueryRequestDto, PaginatedDto } from '../dto';
import { QueryHelper } from '../helpers';

@Injectable()
export class FraudListsService {
  constructor(
    @InjectModel(FraudListSchemaName) private readonly fraudListsModel: Model<FraudListModel>,
  ) { }

  public async createFraudList(
    fraudListDto: FraudListRequestDto,
    businessId: string,
  ): Promise<FraudListModel> {
    return this.fraudListsModel.create({
      ...fraudListDto,
      businessId: businessId,
    });
  }

  public async updateFraudList(
    fraudRuleId: string,
    fraudListDto: FraudListRequestDto,
    businessId: string,
  ): Promise<FraudListModel> {
    return this.fraudListsModel.findOneAndUpdate(
      {
        _id: fraudRuleId,
      },
      {
        $set: {
          ...fraudListDto,
          businessId: businessId,
        },
      },
      {
        new: true,
      },
    );
  }

  public async deleteFraudListById(
    fraudRuleId: string,
  ): Promise<void> {
    await this.fraudListsModel.deleteOne({
      _id: fraudRuleId,
    });
  }

  public async getFraudListsPaginated(
    businessId: string,
    query: ItemsQueryRequestDto,
  ): Promise<any> {
    const paginatedDto: PaginatedDto = QueryHelper.preparePaginatedDto(businessId, query);

    const fraudLists: FraudListModel[] = await this.getFraudLists(
      paginatedDto.condition,
      query,
      paginatedDto.offset,
      paginatedDto.limit,
    );

    const total: number = await this.getFraudListsCount(paginatedDto.condition);
    const totalPages: number = Math.floor(total / paginatedDto.limit) + 1;

    return {
      lists: fraudLists,
      page: paginatedDto.page,
      pageSize: paginatedDto.limit,
      total,
      totalPages,
    };
  }

  public async getFraudLists(
    conditions: any,
    query: ItemsQueryRequestDto,
    offset: number,
    limit: number,
  ): Promise<FraudListModel[]> {
    return this.fraudListsModel
      .find(conditions)
      .select(query.projection)
      .sort({ [query.orderBy]: query.direction })
      .skip(offset)
      .limit(limit);
  }

  public async getFraudListsCount(conditions: any): Promise<number> {
    return this.fraudListsModel.countDocuments(conditions);
  }

}
