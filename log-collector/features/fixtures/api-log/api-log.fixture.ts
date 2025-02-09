import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';

import { ApiLogModel } from '../../../src/api-log/models';
import { ApiLogSchemaName } from '../../../src/api-log/schemas';
import { ApiLogFactory } from '../../fixture-factories/api-log.factory';

class TestFixture extends BaseFixture {
  private apiLogModel: Model<ApiLogModel> =
    this.application.get(getModelToken(ApiLogSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
    const userId: string = 'uuuuuuuu-uuuu-uuuu-uuuu-uuuuuuuuuuuu';
    for (let index = 0; index < 10; index++) {
      const logData: ApiLogModel =
        await this.apiLogModel.create(ApiLogFactory.create({
          userId,
          businessId,
          source: index % 2 === 0 ? 'api' : 'payever',
          serviceName: index % 2 === 0 ? 'service1' : 'service2',
        }));

      await logData.save();
    }
  }

}

export = TestFixture;
