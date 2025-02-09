import { SampleUserMediaSchemaName } from '../src/sample-data/schemas';
import {
  SAMPLE_MEDIAS,
} from './20200702231600-sample-category-media/data/sample-data';
import { BaseMigration } from '@pe/migration-kit';
import { Document, Model } from 'mongoose';

export class SampleAttributesAndMedias extends BaseMigration {
  public async up(): Promise<void> {
    return ;
    const modelMedias: Model<any> = this.connection.model(SampleUserMediaSchemaName);
    await modelMedias.deleteMany({ });
    await modelMedias.insertMany(SAMPLE_MEDIAS);
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return '';
  }

  public migrationName(): string {
    return 'SampleData';
  }

  public version(): number {
    return 2;
  }
}
