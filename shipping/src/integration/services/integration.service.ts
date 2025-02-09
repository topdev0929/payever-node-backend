import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IntegrationInterface } from '../interfaces';
import { IntegrationModel } from '../models';
import { IntegrationSchemaName } from '../schemas';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(IntegrationSchemaName) private readonly integrationModel: Model<IntegrationModel>,
  ) { }

  public async findOneById( integrationId: string ): Promise<IntegrationModel> {

    return this.integrationModel.findOne({ _id: integrationId });
  }

  public async findOneByName( integrationName: string ): Promise<IntegrationModel> {

    return this.integrationModel.findOne({ name: integrationName });
  }

  public async create( integration: IntegrationInterface ): Promise<IntegrationModel> {

    return this.integrationModel.create(integration);
  }

  public async update(integrationId: string, dto: any ): Promise<IntegrationModel> {
    await this.integrationModel.findByIdAndUpdate(
      { _id: integrationId },
      {
        $set: {
          ...dto,
        },
      },
    ).exec();

    return this.integrationModel.findOne({ _id: integrationId });
  }

  public async delete(integrationId: string): Promise<void> {
    await this.integrationModel.findByIdAndDelete(
      integrationId,
    ).exec();
  }
}
