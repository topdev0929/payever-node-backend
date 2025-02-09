/* eslint-disable object-literal-sort-keys */
import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { SectionModel } from '../../../../src/checkout';
import { SectionSchemaName } from '../../../../src/mongoose-schema';
import { SectionFactory } from '../../../fixture-factories';

class TestFixture extends BaseFixture {
  private sectionModel: Model<SectionModel> = this.application.get(getModelToken(SectionSchemaName));

  public async apply(): Promise<void> {

    await this.sectionModel.create(SectionFactory.createDefaultSections());
  }
}

export = TestFixture;
