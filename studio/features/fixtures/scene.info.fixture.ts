import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { VideoGeneratorTaskModel } from '../../src/studio/models';
import { SceneInfoSchemaName } from '../../src/studio/schemas/scene-info.schema';
import * as fs from 'fs';

const BUSINESS_ID: string = '08d30292-0b3c-4b5d-a6ec-93ba43d6c81d';

class TaskFixture extends BaseFixture {
  private readonly sceneInfoModel: Model<VideoGeneratorTaskModel> = this.application.get(getModelToken(SceneInfoSchemaName));

  public async apply(): Promise<void> {
    const sceneInfo: any[] = JSON.parse(fs.readFileSync('./features/data/scene-info.json', 'utf8'));
    await this.sceneInfoModel.create(sceneInfo);
  }
}

export = TaskFixture;
