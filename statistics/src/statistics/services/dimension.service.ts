import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DimensionModel } from '../models';
import { DimensionSchemaName } from '../schemas';

@Injectable()
export class DimensionService {
  constructor(
    @InjectModel(DimensionSchemaName)
    private readonly dimensionModel: Model<DimensionModel>,
  ) { }

  public async findAll(conditions: any = { }): Promise<DimensionModel[]> {
    return this.dimensionModel.find(conditions).sort({ name: 1 }).exec();
  }
}
