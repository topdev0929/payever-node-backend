import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FraudRuleSchemaName } from '../schemas';
import { FraudRuleModel } from '../models';
import { FraudRuleRequestDto, ItemsQueryRequestDto, PaginatedDto } from '../dto';
import { QueryHelper } from '../helpers';

@Injectable()
export class FraudRulesService {
  constructor(
    @InjectModel(FraudRuleSchemaName) private readonly fraudRuleModel: Model<FraudRuleModel>,
  ) { }

  public async createFraudRule(
    fraudRuleDto: FraudRuleRequestDto,
    businessId: string,
  ): Promise<FraudRuleModel> {
    return this.fraudRuleModel.create({
      ...fraudRuleDto,
      businessId: businessId,
    });
  }

  public async updateFraudRule(
    fraudRuleId: string,
    fraudRuleDto: FraudRuleRequestDto,
    businessId: string,
  ): Promise<FraudRuleModel> {
    return this.fraudRuleModel.findOneAndUpdate(
      {
        _id: fraudRuleId,
      },
      {
        $set: {
          ...fraudRuleDto,
          businessId: businessId,
        },
      },
      {
        new: true,
      },
    );
  }

  public async deleteFraudRuleById(
    fraudRuleId: string,
  ): Promise<void> {
     await this.fraudRuleModel.deleteOne({
      _id: fraudRuleId,
    });
  }

  public async getFraudRulesPaginated(
    businessId: string,
    query: ItemsQueryRequestDto,
  ): Promise<any> {
    const paginatedDto: PaginatedDto = QueryHelper.preparePaginatedDto(businessId, query);

    const fraudRules: FraudRuleModel[] = await this.getFraudRules(
      paginatedDto.condition,
      query,
      paginatedDto.offset,
      paginatedDto.limit,
    );

    const total: number = await this.getFraudRulesCount(paginatedDto.condition);
    const totalPages: number = Math.floor(total / paginatedDto.limit) + 1;

    return {
      page: paginatedDto.page,
      pageSize: paginatedDto.limit,
      rules: fraudRules,
      total,
      totalPages,
    };
  }

  public async getFraudRules(
    conditions: any,
    query: ItemsQueryRequestDto,
    offset: number,
    limit: number,
  ): Promise<FraudRuleModel[]> {
    return this.fraudRuleModel
      .find(conditions)
      .select(query.projection)
      .sort({ [query.orderBy]: query.direction })
      .skip(offset)
      .limit(limit);
  }

  public async getFraudRulesCount(conditions: any): Promise<number> {
    return this.fraudRuleModel.countDocuments(conditions);
  }

}
