import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { RecordModel } from '../../../src/storage/models/record.model';
import { RecordSchemaName } from '../../../src/storage/schemas/record.schema';
import { RecordFactory } from '../../fixture-factories';

class TestFixture extends BaseFixture {
  private recordModel: Model<RecordModel> = this.application.get(getModelToken(RecordSchemaName));

  public async apply(): Promise<void> {
    const id: string = 'a803d4c3-c447-4aab-a8c7-c7f184a8e77f';
    await this.recordModel.create(RecordFactory.create({
      _id: id,
      data: {
        existingProperty1: 1,
        existingProperty2: "value2",
        existingProperty3: {
          existingProperty4: true,
        },
      },
    }));
  }
}

export = TestFixture;
