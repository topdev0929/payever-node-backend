import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CounterModel } from '../models';
import { CounterSchemaName } from '../schemas/counter.schema';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(CounterSchemaName) private readonly counterModel: Model<CounterModel>,
  ) { }

  public async getNextCounter(
    businessId: string,
    namePrefix: string,
    type: string,
  ): Promise<number> {
    const incrementedCounter: CounterModel = await this.counterModel.findOneAndUpdate(
      {
        businessId: businessId,
        name: namePrefix,
        type: type,
      },
      {
        $inc: {
          value: 1,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return incrementedCounter.value;
  }
}
