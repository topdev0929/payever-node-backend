import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { ScheduleModel } from '../../../src/modules/campaign/models';
import { ScheduleSchemaName } from '../../../src/modules/mongoose-schema/mongoose-schema.names';
import { ScheduleFactory } from '../factories';
import { CAMPAIGN_ID } from './constants';

const SCHEDULE_ID: string = '372a7cc5-eb3d-4505-91f2-a48acf7c9cb9';

class ScheduleFixture extends BaseFixture {
  protected readonly scheduleModel: Model<ScheduleModel> = this.application.get(getModelToken(ScheduleSchemaName));

  public async apply(): Promise<void> {
    await this.scheduleModel.create(ScheduleFactory.create({
      _id: SCHEDULE_ID,
      campaign: CAMPAIGN_ID,
      date: '2022-05-03',
      interval: {
        number: 123,
        type: 'week',
      },
      recurring: {
        fulfill: 123,
        target: 2,
      },
      type: 'now',


    }));
  }
}

export = ScheduleFixture;
