import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DefaultStepModel } from '../models';
import { DefaultStepSchemaName } from '../schemas';
import { SectionsEnum } from '../enums';

@Injectable()
export class DefaultStepService {
  constructor(
    @InjectModel(DefaultStepSchemaName) private readonly defaultStepModel: Model<DefaultStepModel>,
  ) { }

  public async getListForSection(section: SectionsEnum): Promise<DefaultStepModel[]> {
    return this.defaultStepModel.find({ section });
  }
}
