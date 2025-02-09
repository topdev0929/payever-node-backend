import { HttpService, Injectable, Logger } from '@nestjs/common';
import { ConnectionPlanModel, SubscriptionModel, ProductModel } from '../models';
import { ConnectionModel } from '../../integrations/models/connection.model';
import { BusinessModel } from '../../business';
import { environment } from '../../environments';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/index';
import { TokensGenerationService, TokensResultModel } from '@pe/nest-kit';
import { ThirdPartyActionsEnum } from '../enums';
import { ConnectionPlanInterface } from '../interfaces/entities';

@Injectable()
export class ThirdParty {
  private thirdPartyUrl: string;

  constructor(
    private readonly logger: Logger,
    private readonly httpService: HttpService,
    private readonly tokenGenerationService: TokensGenerationService,
  ) {
    this.thirdPartyUrl = environment.thirdPartyUrl;
  }

  public async createPlan(plan: ConnectionPlanModel): Promise<void> {
    await this.post(
      this.composeUrl(ThirdPartyActionsEnum.CreatePlan, plan.business.id, plan.connection),
      {
        billingPeriod: plan.subscriptionPlan.billingPeriod,
        business: {
          id: plan.business.id,
        },
        currency: plan.business.currency,
        id: plan.id,
        interval: plan.subscriptionPlan.interval,
        name: plan.subscriptionPlan.name,
        products: (plan.subscriptionPlan.products as ProductModel[]).map((product: ProductModel) => {
          return {
            id: product._id,
            title: product.title,
          };
        }),
      },
    );
  }

  public async updatePlan(plan: ConnectionPlanInterface): Promise<void> {

  }

  public async deletePlan(plan: ConnectionPlanModel): Promise<void> {
    try {
      await this.post(
        this.composeUrl(ThirdPartyActionsEnum.DeletePlan, plan.business.id, plan.connection),
        {
          id: plan.id,
          products: (plan.subscriptionPlan.products as ProductModel[]).map((product: ProductModel) => {
            return {
              id: product._id,
            };
          }),
        },
      );
    } catch (e) {
      this.logger.error(e.response.body);
    }
  }

  public async unsubscribe(subscription: SubscriptionModel, business: BusinessModel): Promise<void> {
    return this.post(
      this.composeUrl(
        ThirdPartyActionsEnum.Unsubscribe,
        business.id,
        (subscription.plan as ConnectionPlanModel).connection,
        ),
      {
        ids: [subscription.remoteSubscriptionId],
      },
    );
  }

  public async unsubscribeMany(
    subscriptions: SubscriptionModel[],
    connection: ConnectionModel,
    business: BusinessModel,
  ): Promise<void> {
    return this.post(
      this.composeUrl(ThirdPartyActionsEnum.Unsubscribe, business.id, connection),
      {
        ids: subscriptions.map((subscription: SubscriptionModel) => subscription.remoteSubscriptionId),
      },
    );
  }

  private async post(url: string, data: { } = { }): Promise<any> {
    this.logger.log(data, url);
    const response: Observable<any> = this.httpService
      .post(
        url,
        data,
        {
          headers: await this.getHeaders(),
        },
      );

    return response
      .pipe(map((res: any) => {
        return res.data;
      }))
      .toPromise()
      ;
  }

  private composeUrl(action: string, businessId: string, connection: ConnectionModel): string {
    return `${this.thirdPartyUrl}/api/business/${businessId}/connection/${connection.id}/action/${action}`;
  }

  private async getHeaders(): Promise<{ }> {
    const userAgent: string = 'Billing Subscriptions';
    const token: TokensResultModel = await this.tokenGenerationService.issueSystemToken(userAgent);

    return {
      Accept: 'application/json',
      Authorization: `Bearer ${token.accessToken}`,
      'User-Agent': userAgent,
    };
  }
}
