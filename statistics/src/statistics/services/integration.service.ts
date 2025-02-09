import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IntegrationModel } from '../models/integration.model';
import { IntegrationSchemaName } from '../schemas/integration.schema';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(IntegrationSchemaName)
    private readonly integrationModel: Model<IntegrationModel>,
  ) { }

  public async findOne(sort: any): Promise<IntegrationModel> {
    return this.integrationModel.findOne().sort(sort).exec();
  }

  public async find(conditions: any): Promise<IntegrationModel[]> {
    return this.integrationModel.find(conditions);
  }
}
