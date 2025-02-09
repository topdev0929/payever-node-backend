import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { AppSchemaName } from '../../src/spotlight/schemas';
import { SuggestedApps } from '../../fixtures/suggested-apps';

class SuggestedAppFixture extends BaseFixture {
  private appModel: Model<any> = this.application.get(getModelToken(AppSchemaName));

  public async apply(): Promise<void> {
    await this.insertData(SuggestedApps, this.appModel);
  }

  private async insertData(
    apps: any[],
    model: Model<any>,
  ): Promise<void> {
    for (const data of apps) {
      await model.create(data);
    }
  }
}

export = SuggestedAppFixture;
