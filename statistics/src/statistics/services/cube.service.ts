import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CubeModel } from '../models';
import { CubeSchemaName } from '../schemas';

@Injectable()
export class CubeService {
  constructor(
    @InjectModel(CubeSchemaName)
    private readonly cubeModel: Model<CubeModel>,
  ) { }

  public async findAll(): Promise<CubeModel[]> {
    return this.cubeModel.find({ }).sort({ name: 1 }).exec();
  }

  public async toggleEnable(cube: CubeModel): Promise<CubeModel> {
    await this.cubeModel.updateOne(
      { _id: cube.id },
      { 
        $set: {
          enabled: !cube.enabled,
        },
      },
    );

    return this.cubeModel.findById(cube.id);
  }
}
