import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command } from '@pe/nest-kit/modules/command';
import { Model } from 'mongoose';
import { SubscriptionRabbitMessagesEnum } from '../enums';
import { SubscriptionPlanModel } from '../models';
import { SubscriptionPlanSchemaName } from '../schemas';
import { RabbitProducer } from '../services';


@Injectable()
export class SubscriptionPlanExportCommand {
  constructor(
    @InjectModel(SubscriptionPlanSchemaName) private readonly subscriptionPlanModel: Model<SubscriptionPlanModel>,
    private readonly rabbitProducer: RabbitProducer,
  ) { }

  @Command({ command: 'subscription-plans:export', describe: 'Export subscription plans through the bus' })
  public async subscriptionPlanExport(): Promise<void> {
    const count: number = await this.subscriptionPlanModel.countDocuments({ }).exec();
    const limit: number = 100;
    let start: number = 0;
    let subscriptionPlans: SubscriptionPlanModel[] = [];

    while (start < count) {
      subscriptionPlans = await this.getWithLimit(start, limit);
      start += limit;

      for (const subscriptionPlan of subscriptionPlans) {
        await this.produceExportEvent(subscriptionPlan);
      }
    }
  }

  private async getWithLimit(start: number, limit: number): Promise<SubscriptionPlanModel[]> {
    return this.subscriptionPlanModel.find(
      { },
      null,
      {
        limit: limit,
        skip: start,
        sort: { createdAt: 1 },
      },
    );
  }

  private async produceExportEvent(subscriptionPlan: SubscriptionPlanModel): Promise<void> {
    await this.rabbitProducer.send(SubscriptionRabbitMessagesEnum.SubscriptionExport, 
      {
        ...subscriptionPlan.toObject(),
        business: {
          id: subscriptionPlan.businessId,
        },
      },
    );
  }
}
