import { PlanHttpResponseDto } from '../dto';
import { ConnectionPlanModel } from '../models';

export class PlanResponseConverter {
  public static async listFromPlans(plans: ConnectionPlanModel[]): Promise<PlanHttpResponseDto[]> {
    const planResponses: PlanHttpResponseDto[] = [];
    for (const plan of plans) {
      await plan.subscriptionPlan.populate('product').execPopulate();

      planResponses.push({
        _id: plan.id,
        business: plan.business.id,
        connection: {
          _id: plan.connection.id,
          integrationName: plan.connection.integrationName,
        },
        products: plan.subscriptionPlan.products as string[],
        subscriptionPlan: {
          _id: plan.subscriptionPlan.id,
          billingPeriod: plan.subscriptionPlan.billingPeriod,
          interval: plan.subscriptionPlan.interval,
          planType: plan.subscriptionPlan.planType,
          price: plan.subscriptionPlan.totalPrice,
          products: plan.subscriptionPlan.products as string[],
          shortName: plan.subscriptionPlan.shortName,
          subscribersTotals: plan.subscriptionPlan.subscribersTotals,
          theme: plan.subscriptionPlan.theme,
        },
      });
    }

    return planResponses;
  }
}
