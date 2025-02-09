import { BaseFixture } from "@pe/cucumber-sdk";
import { metricsFixture } from '../../fixtures/metrics.fixture';

class MetricFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('metrics').insertMany(metricsFixture);
  }
}

export = MetricFixture;
