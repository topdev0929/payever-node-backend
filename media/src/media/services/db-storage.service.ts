import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DataModel } from '../models';
import { DataSchemaName } from '../schemas';

@Injectable()
export class DbStorageService {
  private cleanupInterval: NodeJS.Timer;

  constructor(@InjectModel(DataSchemaName) private readonly dataModel: Model<DataModel>) {
    this.cleanupInterval = setInterval(() => { this.makeCleanup().then(() => { }); }, 1000 * 60 * 60); // once an hour
  }

  public async getById(id: string): Promise<DataModel> {
    const data: DataModel = await this.dataModel.findOne({ _id: id });
    if (data && typeof data.data === 'string') {
      data.data = JSON.parse(data.data);
    }

    return data;
  }

  public async createData(
    createDto: {
      id?: string;
      data: any;
      expiresAt?: string;
    },
  ): Promise<DataModel> {
    if (createDto.data) {
      createDto.data = JSON.stringify(createDto.data);
    }

    const data: DataModel = await this.dataModel.create(
      { ...createDto, _id: createDto.id } as DataModel,
    );

    if (data && typeof data.data === 'string') {
      data.data = JSON.parse(data.data);
    }

    return data;
  }

  public async createFile(fileName: string): Promise<DataModel> {
    return this.dataModel.create({ file: fileName } as DataModel);
  }

  public async updateById(
    id: string,
    updateDto: {
      expiresAt: string;
      data: any;
    },
  ): Promise<DataModel> {
    return this.dataModel.findOneAndUpdate(
      { _id: id },
      { $set: updateDto },
      { new: true },
    );
  }

  public async deleteById(id: string): Promise<void> {
    await this.dataModel.deleteOne({ _id: id });
  }

  private async makeCleanup(): Promise<void> {
    await this.dataModel.deleteMany({ expiresAt: { $lte: new Date() } });
  }
}
