import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { SAMPLE_MEDIAS } from '../data/sample-data';
import { SampleUserMediaModel } from '../../src/sample-data/models';
import { SampleUserMediaSchemaName } from '../../src/sample-data/schemas';

class SampleDataFixture extends BaseFixture {
  private readonly sampleUserMediaModel: Model<SampleUserMediaModel> =
    this.application.get(getModelToken(SampleUserMediaSchemaName));

  public async apply(): Promise<void> {
    await this.sampleUserMediaModel.create(SAMPLE_MEDIAS);
  }
}

export = SampleDataFixture;
