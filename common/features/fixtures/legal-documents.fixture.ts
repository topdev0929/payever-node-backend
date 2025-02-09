import { BaseFixture } from '@pe/cucumber-sdk';
import { v4 as uuid } from 'uuid';

class LegalFormsFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('legaldocuments').insertOne({
      _id: 'legal-doc-ument-3j8',
      content: 'string',
      type: 'disclaimer',
    });
  }
}

export = LegalFormsFixture;
