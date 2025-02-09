import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrationRuleModel } from '../models';
import { IntegrationRuleSchemaName } from '../schemas';
import { CreateIntegrationRuleDto, UpdateIntegrationRuleDto } from '../dto/rules';

@Injectable()
export class IntegrationRuleService {
  private logger: Logger = new Logger(IntegrationRuleService.name, true);

  constructor(
    @InjectModel(IntegrationRuleSchemaName)
    private readonly integrationRuleModel: Model<IntegrationRuleModel>,
  ) {
  }

  public async create(dto: CreateIntegrationRuleDto): Promise<IntegrationRuleModel> {
    return this.integrationRuleModel.create(dto as IntegrationRuleModel);
  }

  public async findById(id: string): Promise<IntegrationRuleModel> {
    return this.integrationRuleModel.findOne({ _id: id });
  }

  public async update(rule: IntegrationRuleModel, dto: UpdateIntegrationRuleDto): Promise<IntegrationRuleModel> {
    return this.integrationRuleModel.findOneAndUpdate(
      { _id: rule._id },
      { $set: dto as IntegrationRuleModel },
      { new: true },
    );
  }

  public async delete(rule: IntegrationRuleModel): Promise<IntegrationRuleModel> {
    return this.integrationRuleModel.findOneAndDelete({ _id: rule._id });
  }

  public async createDefaultRules(): Promise<IntegrationRuleModel[]> {
    const defaultRulesFixture: IntegrationRuleModel[] = [
      {
        freeOver: null,
      } as IntegrationRuleModel, {
        flatRate: 1,
      } as IntegrationRuleModel, {
        weightRanges: [{
          from: null,
          rate: null,
          upTo: null,
        }],
      } as IntegrationRuleModel, {
        rateRanges: [{
          from: null,
          rate: null,
          upTo: null,
        }],
      } as IntegrationRuleModel];

    return this.integrationRuleModel.insertMany(defaultRulesFixture);
  }
}
