import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SampleUserMediaInterface } from '../interfaces';
import { SampleUserMediaModel } from '../models';
import { SampleUserMediaSchemaName } from '../schemas';

@Injectable()
export class SampleDataService {
  constructor(
    @InjectModel(SampleUserMediaSchemaName) private readonly sampleUserMediaModel: Model<SampleUserMediaModel>,
  ) { }

  public async getMedia(): Promise<SampleUserMediaInterface[]> {
    const data: SampleUserMediaModel[] = await this.sampleUserMediaModel.find({ }).exec();

    return data.map((item: SampleUserMediaModel) => item.toObject());
  }
}
