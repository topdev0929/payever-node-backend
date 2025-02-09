import { BaseFixture } from '@pe/cucumber-sdk';

class IntegrationAccessesFixture extends BaseFixture {
  public async apply(): Promise<void> {
    await this.connection.collection('integrationaccesses').insertOne({
      _id: '754aea78-6d21-4400-a65e-a11d0ae6348b',
      name : 'jira',
      token : '78c5b4b5-f47c-43bb-8f60-7f3d422071a9'
    });
  }
}

export = IntegrationAccessesFixture;