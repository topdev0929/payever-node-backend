import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import { SubscriptionPlanModel } from '../models';
import { ConnectionPlanModel } from '../models/connection-plan.model';
import { ConnectionPlanSchemaName } from '../schemas';
import { ThirdParty } from './third-party.service';
import { PlanEventsEnum } from '../enums';
import { EventDispatcher } from '@pe/nest-kit';
import { ConnectionModel } from '../../integrations/models/connection.model';

export class ConnectionPlans {
  constructor(
    @InjectModel(ConnectionPlanSchemaName) private readonly plansModel: Model<ConnectionPlanModel>,
    private readonly thirdPartyService: ThirdParty,
    private readonly eventDispatcher: EventDispatcher,
  ) { }

  public async create(
    subscriptionPlan: SubscriptionPlanModel,
    connection: ConnectionModel,
  ): Promise<ConnectionPlanModel> {
    const plan: ConnectionPlanModel = await this.plansModel.create({
      businessId: subscriptionPlan.business._id,
      connection: connection.id,
      subscriptionPlan: subscriptionPlan,
    } as ConnectionPlanModel);
    await plan
      .populate('subscriptionPlan')
      .populate('business')
      .populate('connection')
      .execPopulate();

    await plan.subscriptionPlan
      .populate('products')
      .execPopulate();

    await this.thirdPartyService.createPlan(plan);

    return plan;
  }

  public async deleteBySubscriptionPlanAndConnection(
    subscriptionPlan: SubscriptionPlanModel,
    connection: ConnectionModel,
  ): Promise<ConnectionPlanModel> {
    const plan: ConnectionPlanModel = await this.findBySubscriptionPlanAndConnection(subscriptionPlan, connection);

    return this.delete(plan);
  }

  public async delete(plan: ConnectionPlanModel): Promise<ConnectionPlanModel> {
    await plan
      .populate('business')
      .populate('subscriptionPlan')
      .populate('connection')
      .execPopulate();

    await plan.subscriptionPlan
      .populate('products')
      .execPopulate();

    await this.thirdPartyService.deletePlan(plan);
    await this.eventDispatcher.dispatch(PlanEventsEnum.PlanDeleted, plan);

    return this.plansModel.findByIdAndDelete(plan.id);
  }

  public async isPlanExists(subscriptionPlan: SubscriptionPlanModel, connection: ConnectionModel): Promise<boolean> {
    return (await this.findBySubscriptionPlanAndConnection(subscriptionPlan, connection)) !== null;
  }

  public async getPlansForSubscriptionPlanList(
    subscriptionPlans: SubscriptionPlanModel[],
    business: BusinessModel,
  ): Promise<ConnectionPlanModel[]> {

    return this.plansModel
      .find({
        businessId: business.id,
        subscriptionPlan: {
          $in: subscriptionPlans,
        },
      })
      .populate('business')
      .populate('connection')
      .populate('subscriptionPlan');
  }

  public async getById(id: string): Promise<ConnectionPlanModel> {
    return this.plansModel.findOne({
      _id: id,
    });
  }

  public async removePlansBySubscriptionPlan(subscriptionPlan: SubscriptionPlanModel): Promise<void> {
    const plans: ConnectionPlanModel[] = await this.plansModel.find({ subscriptionPlan: subscriptionPlan.id });
    for (const plan of plans) {
      await this.delete(plan);
    }
  }

  public async getByBusiness(business: BusinessModel): Promise<ConnectionPlanModel[]> {
    return this.plansModel
      .find({
        businessId: business.id,
      })
      .populate('business')
      .populate('connection')
      .populate('subscriptionPlan');
  }

  private async findBySubscriptionPlanAndConnection(
    subscriptionPlan: SubscriptionPlanModel,
    connection: ConnectionModel,
  ): Promise<ConnectionPlanModel> {
    return this.plansModel.findOne({
      connection: connection.id,
      subscriptionPlan: subscriptionPlan.id,
    });
  }
}
