import { CommonFixture, BUSINESS_ID } from './common.fixture';
import { BusinessFactory } from '../factories';

export class BusinessFixture extends CommonFixture {
  public async apply(): Promise<void> {
    await this.businessModel.create(BusinessFactory.create({
      _id: BUSINESS_ID,
    }));
  }
}
