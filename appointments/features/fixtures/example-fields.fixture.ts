import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';

import { FieldDocument, Field } from '../../src/appointments/schemas';
import { exampleFieldsFixture } from './data/example-fields.data';

class ExampleFieldsFixture extends BaseFixture {
  protected readonly fieldModel: Model<FieldDocument> =
    this.application.get(getModelToken(Field.name));

  public async apply(): Promise<void> {
    await this.fieldModel.create(exampleFieldsFixture);
  }
}

export = ExampleFieldsFixture;
