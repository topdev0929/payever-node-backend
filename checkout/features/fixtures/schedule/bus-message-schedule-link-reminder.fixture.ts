import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { Model } from 'mongoose';
import { ScheduleSchemaName } from '../../../src/mongoose-schema';
import { DurationTypeEnum, DurationUnitEnum, ScheduleModel, TaskTypeEnum } from '../../../src/scheduler';
import { ScheduleFactory } from '../../fixture-factories/schedule.factory';
import { BusinessModel } from '@pe/business-kit/modules';
import { BusinessSchemaName } from '@pe/business-kit';
import { BusinessFactory } from '../../fixture-factories';
import { UrlActionsEnum } from '../../../src/legacy-api';

class TestFixture extends BaseFixture {
  private businessModel: Model<BusinessModel> = this.application.get(getModelToken(BusinessSchemaName));
  private scheduleModel: Model<ScheduleModel> = this.application.get(getModelToken(ScheduleSchemaName));

  public async apply(): Promise<void> {
    const businessId: string = '012c165f-8b88-405f-99e2-82f74339a757';
    const scheduleId1: string = '23e03d97-7ad8-4b16-ae32-51734cea5edd';

    const business: BusinessModel = await this.businessModel.create(BusinessFactory.create({
      _id: businessId,
    }) as any);

    await this.scheduleModel.create(ScheduleFactory.create({
      _id: scheduleId1,
      businessId: business.id,
      task: TaskTypeEnum.paymentLinkReminder,
      duration: {
        type: DurationTypeEnum.every,
        unit: DurationUnitEnum.day,
        period: 5,
      },
      enabled: true,
    }) as any);
  }
}

export = TestFixture;
