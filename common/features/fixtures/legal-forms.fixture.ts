import { BaseFixture } from '@pe/cucumber-sdk';
import { v4 as uuid } from 'uuid';

class LegalFormsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('legalforms').insertOne({
      _id: 'legal-form-1g3g',
      abbreviation: 'abbreviation',
      country: 'DE',
      description: 'description',
    });
  }
}

export = LegalFormsFixture;
