import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessSchemaName } from '../../mongoose-schema/mongoose-schema.names';
import { Model } from 'mongoose';
import { BusinessModel } from '../models';

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(BusinessSchemaName) private readonly businessModel: Model<BusinessModel>,
    private logger: Logger,
  ) { }

  public async getById(businessId: string): Promise<BusinessModel> {
    return this.businessModel.findById(businessId);
  }
}
