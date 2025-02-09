import {
  InjectModel,
} from '@nestjs/mongoose';
import {
  Model,
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  Query,
} from 'mongoose';

import { IntegrationDocument } from '../models';
import { IntegrationSchemaName } from '../schema';

export class IntegrationService {
  constructor(
    @InjectModel(IntegrationSchemaName)
      private readonly integrationModel: Model<IntegrationDocument>,
  ) { }

  public async create(
    data: DocumentDefinition<IntegrationDocument>,
  ): Promise<IntegrationDocument> {
    return this.integrationModel.create(data);
  }

  public find(filter: FilterQuery<IntegrationDocument>): Query<IntegrationDocument[], IntegrationDocument> {
    return this.integrationModel.find(filter);
  }

  public async update(
    data: UpdateQuery<IntegrationDocument> & { _id: string },
  ): Promise<IntegrationDocument> {
    return this.integrationModel.findByIdAndUpdate(
      data._id,
      data,
      {
        new: true,
      },
    );
  }

  public async delete(_id: string): Promise<IntegrationDocument> {
    return this.integrationModel.findByIdAndDelete(_id);
  }
}
