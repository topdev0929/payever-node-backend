import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IntegrationSubscriptionInterface, RateInterface, IntegrationRateInterface } from '../interfaces';
import { BusinessModel } from '../../business/models';
import { IntegrationModel, IntegrationSubscriptionModel, IntegrationRuleModel } from '../models';
import { IntegrationSubscriptionSchemaName } from '../schemas';
import { RateCalculator } from '../../common';
import { GetRatesRequestDto } from '../../channel-set/dto';
import {
  ShippingMethodInterface,
} from '../../shipping/interfaces';
import { ThirdPartyService } from './third-party.service';
import { EventDispatcher } from '@pe/nest-kit';
import { FastifyRequest } from 'fastify';
import { IntegrationSubscriptionEvent } from '../enums/integration-subscribtion.events.enum';

@Injectable()
export class IntegrationSubscriptionService {
  private logger: Logger = new Logger(IntegrationSubscriptionService.name, true);

  constructor(
    @InjectModel(IntegrationSubscriptionSchemaName) 
    private readonly subscriptionModel: Model<IntegrationSubscriptionModel>,
    private readonly thirdPartyService: ThirdPartyService,
    private readonly dispatcher: EventDispatcher,
  ) {
  }

  public async install(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: true },
      { new: true },
    );
    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(integration, business);
    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { installed: false, enabled: false },
      { new: true },
    );
    await updatedSubscription.populate('integration').execPopulate();

    return updatedSubscription;
  }

  public async removeAllIntegrationSubscriptionsOfBusiness(business: BusinessModel): Promise<void> {
    const integrationSubscriptions: IntegrationSubscriptionModel[] = await this
      .getSubscriptionsWithIntegrations(business);

    for (const subscription of integrationSubscriptions) {
      this.logger.log('subscription ' + subscription);
      await subscription.remove();
    }
  }

  public async getSubscriptionsWithIntegrations(business: BusinessModel): Promise<IntegrationSubscriptionModel[]> {
    await business.populate('integrationSubscriptions').execPopulate();
    for (const subscription of business.integrationSubscriptions) {
      await subscription.populate('integration').execPopulate();
      await subscription.populate('integration.integrationRules').execPopulate();
    }

    return business.integrationSubscriptions;
  }

  public async findOneByIntegrationAndBusiness(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {

    return this.findOrCreateSubscription(integration, business);
  }

  public async enable(
    subscription: IntegrationSubscriptionModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    this.logger.log(`integration installed ${subscription}`);
    await subscription.populate('integration').execPopulate();
    await this.dispatcher.dispatch(
      IntegrationSubscriptionEvent.IntegrationSubscribed,
      { business, integrationSub: subscription },
    );

    await this.dispatcher.dispatch(
      IntegrationSubscriptionEvent.ThirdPartyShippingEnabled,
      business,
    );

    return this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { enabled: true },
      { new: true },
    );
  }

  public async disable(subscription: IntegrationSubscriptionModel): Promise<IntegrationSubscriptionModel> {

    return this.subscriptionModel.findOneAndUpdate(
      { _id: subscription.id },
      { enabled: false },
      { new: true },
    );
  }

  public async findAllAwaitingShippingDataSync(
    lastSynced: Date,
    limit: number,
    offset: number,
  ): Promise<IntegrationSubscriptionModel[]> {
    return this.subscriptionModel
      .find({
        $or: [
          {
            lastSynced: {
              $lte: lastSynced,
            },
          },
          {
            lastSynced: {
              $eq: null,
            },
          },
        ],
      })
      .limit(limit)
      .skip(offset);
  }

  public async setLastSyncDate(
    integrationSubs: IntegrationSubscriptionModel,
    lastSynced: Date,
  ): Promise<IntegrationSubscriptionModel> {
    return this.subscriptionModel.findByIdAndUpdate(integrationSubs.id, {
      lastSynced,
    });
  }

  public async findById(id: string): Promise<IntegrationSubscriptionModel> {

    return this.subscriptionModel.findOne({ _id: id });
  }

  public async findOrCreateSubscription(
    integration: IntegrationModel,
    business: BusinessModel,
  ): Promise<IntegrationSubscriptionModel> {
    await business.populate('integrationSubscriptions').execPopulate();
    let subscription: IntegrationSubscriptionModel = business.integrationSubscriptions
      .find((record: IntegrationSubscriptionModel) => record.integration === integration.id);
    if (!subscription) {
      const subscriptionDto: IntegrationSubscriptionInterface = {
        enabled: false,
        installed: false,
        integration,
      };
      subscription = await this.subscriptionModel.create(subscriptionDto as IntegrationSubscriptionModel);
      business.integrationSubscriptions.push(subscription);
      await business.save();
    }
    await subscription.populate('integration').execPopulate();

    return subscription;
  }

  public async addRule(
    rule: IntegrationRuleModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationSubscriptionModel> {
    subscription.rules.push(rule);
    await subscription.save();
    await this.populateRules(subscription);

    return subscription;
  }

  public async removeRule(
    rule: IntegrationRuleModel,
    subscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationSubscriptionModel> {
    await subscription.populate('rules').execPopulate();
    subscription.rules.pull(rule);
    await subscription.save();

    return subscription;
  }

  public async populateRules(
    subscription: IntegrationSubscriptionModel,
  ): Promise<IntegrationSubscriptionModel> {
    await subscription.populate('integration').populate({
      path: 'rules',
      populate: { path: 'type' },
    }).execPopulate();

    return subscription;
  }

  public async getCommission(
    business: BusinessModel,
    subscription: IntegrationSubscriptionModel,
    request: FastifyRequest,
  ): Promise<IntegrationRateInterface> {
    return this.thirdPartyService
      .post(
        `business/${business.id}/integration/${subscription.integration.name}/action/get-rates`,
        { },
        {
          'User-Agent': request.headers['user-agent'],
          'authorization': request.headers.authorization,
        },
      );
  }

  public async getRates(
    business: BusinessModel,
    subscription: IntegrationSubscriptionModel,
    dto: GetRatesRequestDto,
  ): Promise<ShippingMethodInterface> {
    const calculatedRate: RateInterface = new RateCalculator(subscription, dto.shippingItems).getRate();
    let result: ShippingMethodInterface;
    if (!calculatedRate && subscription.integration.name !== 'custom') {
      result = {
        business,
        businessId: business._id,
        currency: business.currency,
        integration: subscription.integration,
        integrationRule: null,
        integrationSubscriptionId: subscription._id,
        rate: subscription.integration.flatAmount,
      } as ShippingMethodInterface;
    } else {
      if (!calculatedRate) {
        throw new NotFoundException('shipping.errors.nomatchedrules');
      }
      result = {
        business,
        businessId: business._id,
        currency: '',
        integration: subscription.integration,
        integrationRule: calculatedRate.integrationRule,
        integrationSubscriptionId: subscription._id,
        rate: calculatedRate.rate,
      } as ShippingMethodInterface;
    }

    return result;
  }

  public async setRules(
    subscription: IntegrationSubscriptionModel,
    rules: IntegrationRuleModel[],
  ): Promise<void> {
    subscription.rules = new Types.DocumentArray([]);
    for (const rule of rules) {
      subscription.rules.push(rule);
    }
    await subscription.save();
  }

}
