import {
  BRANCHE_AUTOMOTIVE,
  BRANCHE_BABY,
  BRANCHE_CARE,
  BRANCHE_ELECTRONICS,
  BRANCHE_FASHION,
  BRANCHE_HEALTH_HOUSEHOLD,
  BRANCHE_HOME_KITCHEN,
  BRANCHE_LUGGAGE,
  BRANCHE_MATERIAL_HANDLINGS,
  BRANCHE_SPORTS,
  BRANCHE_TOYS,
} from './20200226090957-sample-products/data';
import { Document, Model } from 'mongoose';
import { BaseMigration } from '@pe/migration-kit';
import { SampleProductDto } from '../src/sample-products/dto/sample-product.dto';

const productSampleList: SampleProductDto[][] = [
  BRANCHE_MATERIAL_HANDLINGS,
  BRANCHE_TOYS,
  BRANCHE_FASHION,
  BRANCHE_ELECTRONICS,
  BRANCHE_AUTOMOTIVE,
  BRANCHE_BABY,
  BRANCHE_SPORTS,
  BRANCHE_HOME_KITCHEN,
  BRANCHE_HEALTH_HOUSEHOLD,
  BRANCHE_CARE,
  BRANCHE_LUGGAGE,
];

export class SampleProducts extends BaseMigration {

  public async up(): Promise<void> {
    await this.connection.dropCollection('sampleproducts');
    const model: Model<Document> = this.connection.model('SampleProducts');
    const promiseArray: Array<Promise<any>> = [ ];
    for (const productSample of productSampleList) {
      promiseArray.push(model.insertMany(productSample));
    }

    await Promise.all(promiseArray);
  }

  public async down(): Promise<void> {
    return null;
  }

  public description(): string {
    return '';
  }

  public migrationName(): string {
    return 'SampleProducts';
  }

  public version(): number {
    return 5;
  }
}
