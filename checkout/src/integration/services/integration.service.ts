import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IntegrationSchemaName } from '../../mongoose-schema';
import { CreateIntegrationDto, UpdateIntegrationDto } from '../dto';
import { IntegrationModel } from '../models';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(IntegrationSchemaName) private readonly integrationModel: Model<IntegrationModel>,
  ) { }

  public async findAll(): Promise<IntegrationModel[]> {
    return this.integrationModel.find().sort({ name: 1 });
  }

  public async findByCategory(category: string): Promise<IntegrationModel[]> {
    const integrations: IntegrationModel[] = await this.integrationModel.find({ category: category });

    return integrations.sort((a: IntegrationModel, b: IntegrationModel) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  public async findOneById(integrationId: string): Promise<IntegrationModel> {
    return this.integrationModel.findOne({ _id: integrationId });
  }

  public async findOneByName(integrationName: string): Promise<IntegrationModel> {
    return this.integrationModel.findOne({ name: integrationName });
  }

  public async findManyByNames(integrationNames: string[]): Promise<IntegrationModel[]> {
    return this.integrationModel.find({ name: { $in: integrationNames }});
  }

  public async findOneByNameAndCategory(
    integrationName: string,
    integrationCategory: string,
  ): Promise<IntegrationModel> {
    return this.integrationModel.findOne({ name: integrationName, category: integrationCategory });
  }

  public async create(
    data: CreateIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationModel.create(data as IntegrationModel);
  }

  public async update(
    integration: IntegrationModel,
    dto: UpdateIntegrationDto,
  ): Promise<IntegrationModel> {
    return this.integrationModel.findOneAndUpdate(
      {
        _id: integration._id,
      },
      {
        $set: dto,
      },
      {
        new: true,
      },
    );
  }

  public async remove(
    integration: IntegrationModel,
  ): Promise<IntegrationModel> {
    return this.integrationModel.findOneAndRemove(
      {
        name: integration.name,
      },
    );
  }
}
