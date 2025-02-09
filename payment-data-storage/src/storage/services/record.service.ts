import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as dm from 'deepmerge';
import { Model } from 'mongoose';
import { UnpackDotNotatedHelper } from '../helpers/unpack-dot-notated.helper';
import { RecordModel } from '../models/record.model';
import { RecordSchemaName } from '../schemas/record.schema';

@Injectable()
export class RecordService {
  constructor(
    @InjectModel(RecordSchemaName) private readonly recordModel: Model<RecordModel>,
  ) { }

  public async save(
    id: string,
    incoming: { },
  ): Promise<RecordModel> {
    const existing: RecordModel = await this.findById(id);
    const processed: { } = UnpackDotNotatedHelper.process(incoming);

    const data: { } = existing
      ? dm.all(
        [ existing.data, processed ],
        {
          arrayMerge: (destinationArray: [], sourceArray: []) => sourceArray,
        },
      )
      : processed
    ;

    return this.upsert(id, data);
  }

  public async upsert(
    id: string,
    data: { },
  ): Promise<RecordModel> {
    return this.recordModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          data,
        },
        $setOnInsert: {
          _id: id,
        },
      },
      {
        new: true,
        upsert: true,
      },
    );
  }

  public async findById(id: string): Promise<RecordModel> {
    return this.recordModel.findById(id);
  }

  public async clearOutdated(date: Date): Promise<void> {
    await this.recordModel.deleteMany({
      updatedAt: {
        $lte: date,
      },
    });
  }
}
