import { BaseFixture } from '@pe/cucumber-sdk/module';
// eslint:disable-next-line no-require-imports
import helper = require('../../fixture-creator-helper');

class TestFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await helper.createFlowFull(
      this.application,
      'a903d4c3-c447-4aab-a8c7-c7f184a8e77f',
      'a903d4c3-c447-4aab-a8c7-c7f184a8e77f',
      'flowId1',
    );
    await helper.createFlowFull(
      this.application,
      'b903d4c3-c447-4aab-a8c7-c7f184a8e77f',
      'check1',
      'flowId2',
      'channelId1',
    );
  }
}

export = TestFixture;
