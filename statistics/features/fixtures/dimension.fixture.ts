import { BaseFixture } from "@pe/cucumber-sdk";
import { dimensionsFixture } from '../../fixtures/dimensions.fixture';

class MetricFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('dimensions').insertMany(dimensionsFixture);
  }
}

export = MetricFixture;
