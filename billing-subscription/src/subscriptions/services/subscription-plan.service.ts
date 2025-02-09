import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business';
import {
  CategoryModel,
  ProductModel,
  SubscribersGroupModel,
  SubscriptionPlanModel,
  SubscriptionPlansGroupModel } from '../models';
import { ConnectionModel } from '../../integrations/models/connection.model';
import { PlanCustomerSchemaName, SubscriptionPlanSchemaName } from '../schemas';
import { PlanFilterFieldsMapping, PlanTypeEnum, SubscriptionPlanEventsEnum } from '../enums';
import {
  CategoryDto,
  CustomerPlanDto,
  ProductBaseDto,
  RetreivePlansForProductsDto,
  SubscribersGroupHttpResponseDto,
  SubscriptionNetworkQueryDto,
  SubscriptionPlanBuilderDto,
  SubscriptionPlanHttpRequestDto,
} from '../dto';
import { Products } from './products.service';
import { ConnectionPlans } from './connection-plans.service';
import { RabbitProducer } from './rabbit-producer.service';
import { EventDispatcher } from '@pe/nest-kit';
import { v4 as uuid } from 'uuid';

import { CustomerPlanModel } from '../models/customer-plan.model';
import { CustomerPlanService } from './customer-plan.service';
import { QueryBuilder } from '../../common/helpers';
import {
  ChannelAwareBusinessModel,
  ChannelEventMessagesProducer,
  ManyToOneChannelSetService,
  ChannelModel,
  ChannelService,
  ChannelSetModel,
  CHANNEL_SET_SERVICE,
} from '@pe/channels-sdk';
import { CategoryService } from './category.service';
import { CustomerGroupsService } from './subscribers-groups.service';
import { SubscriptionPlanInterface } from '../interfaces/entities';

const channelType: string = 'subscription';

@Injectable()
export class SubscriptionPlanService {
  constructor(
    @InjectModel(SubscriptionPlanSchemaName) private readonly subscriptionPlanModel: Model<SubscriptionPlanModel>,
    @InjectModel(PlanCustomerSchemaName) private readonly customerPlan: Model<CustomerPlanModel>,
    @Inject(CHANNEL_SET_SERVICE) private readonly channelSetsService: ManyToOneChannelSetService,
    private readonly productsService: Products,
    private readonly categoryService: CategoryService,
    private readonly customerGroupsService: CustomerGroupsService,
    private readonly customerPlanService: CustomerPlanService,
    private readonly connectionPlansService: ConnectionPlans,
    private readonly rabbitProducer: RabbitProducer,
    private readonly eventDispatcher: EventDispatcher,
    private readonly channelService: ChannelService,
    private readonly channelEventsProducer: ChannelEventMessagesProducer,
  ) { }

  public async create(
    subscriptionPlanDto: SubscriptionPlanHttpRequestDto,
    business: BusinessModel,
  ): Promise<SubscriptionPlanInterface & { applicationScopeElasticId: string; businessScopeElasticId: string }> {
    let productIds: string[] = [];
    if (subscriptionPlanDto.products) {
      productIds = (await Promise.all(
        subscriptionPlanDto.products.map((product: ProductBaseDto) => {
          return this.productsService.createProduct(product, business);
        }))).map((product: ProductModel) => product._id);
    }

    let categories: string[] = [];
    if (subscriptionPlanDto.categories) {
      categories = (await Promise.all(
        subscriptionPlanDto.categories.map((category: CategoryDto) => {
          return this.categoryService.createOrUpdate(category);
        }))).map((category: CategoryModel) => category._id);
    }

    let subscribers: string[] = [];
    if (subscriptionPlanDto.subscribers) {
       subscribers = (await Promise.all(
        subscriptionPlanDto.subscribers.map((subscriber: CustomerPlanDto) => {
          return this.customerPlanService.create(subscriber);
        }))).map((subscriber: CustomerPlanModel) => subscriber._id);
    }

    let subscribersGroups: string[] = [];
    if (subscriptionPlanDto.subscribersGroups) {
      subscribersGroups = (await Promise.all(
        subscriptionPlanDto.subscribersGroups.map((subscribersGroup: SubscribersGroupHttpResponseDto) => {
          return this.customerGroupsService.create(subscribersGroup as SubscribersGroupModel);
        }))).map((subscribersGroup: SubscribersGroupModel) => subscribersGroup._id);
    }

    let channel: ChannelModel = await this.channelService.findOneByType(channelType);

    if (!channel) {
      channel = await this.channelService.create({ type: channelType } as any);
    }

    const channelSet: ChannelSetModel = await this.channelSetsService.create(
      channel,
      business as any as ChannelAwareBusinessModel,
    );
    await this.channelEventsProducer.sendChannelSetNamedByApplication(
      channelSet,
      subscriptionPlanDto.name,
    );

    const subscriptionPlan: SubscriptionPlanModel = await this.subscriptionPlanModel.create({
      appliesTo: subscriptionPlanDto.appliesTo,
      billingPeriod: subscriptionPlanDto.billingPeriod,
      businessId: business._id,
      categories: categories,
      channelSet: channelSet._id,
      interval: subscriptionPlanDto.interval,
      isDefault: subscriptionPlanDto.isDefault,
      name: subscriptionPlanDto.name,
      planType: PlanTypeEnum.fixed,
      products: productIds,
      subscribedChannelSets: subscriptionPlanDto.subscribedChannelSets,
      subscribers: subscribers,
      subscribersEligibility: subscriptionPlanDto.subscribersEligibility,
      subscribersGroups: subscribersGroups,
      subscriptionNetwork: subscriptionPlanDto.subscriptionNetwork,
      totalPrice: subscriptionPlanDto.totalPrice,
    });

    const elasticIds: any = {
      applicationScopeId: uuid(),
      businessScopeId: uuid(),
    };

    await this.eventDispatcher.dispatch(
      SubscriptionPlanEventsEnum.SubscriptionPlanCreated,
      subscriptionPlan,
      { targetFolderId: subscriptionPlanDto.targetFolderId, elasticIds },
    );

    await subscriptionPlan
      .populate('products')
      .populate('business')
      .populate('channelSet')
      .populate('subscribedChannelSets')
      .populate('subscriptionNetwork')
      .populate({
        model: this.customerPlan,
        path: 'subscribers',
      })
      .execPopulate();

    return {
      ...subscriptionPlan.toObject(),
      applicationScopeElasticId: elasticIds.applicationScopeId,
      businessScopeElasticId: elasticIds.businessScopeId,
    } as any;
  }

  public async update(
    subscriptionPlan: SubscriptionPlanModel,
    updateSubscriptionPlanDto: SubscriptionPlanHttpRequestDto,
    business: BusinessModel,
  ): Promise<SubscriptionPlanModel> {
    const set: any = {
      appliesTo: updateSubscriptionPlanDto.appliesTo,
      billingPeriod: updateSubscriptionPlanDto.billingPeriod,
      channelSet: updateSubscriptionPlanDto.channelSet as any,
      interval: updateSubscriptionPlanDto.interval,
      isDefault: updateSubscriptionPlanDto.isDefault,
      name: updateSubscriptionPlanDto.name,
      planType: updateSubscriptionPlanDto.planType,
      shortName: updateSubscriptionPlanDto.shortName,
      subscribedChannelSets: updateSubscriptionPlanDto.subscribedChannelSets,
      subscribersEligibility: updateSubscriptionPlanDto.subscribersEligibility,
      subscribersTotals: updateSubscriptionPlanDto.subscribersTotals,
      subscriptionNetwork: updateSubscriptionPlanDto.subscriptionNetwork,
      totalPrice: updateSubscriptionPlanDto.totalPrice,
    };

    if (updateSubscriptionPlanDto.products) {
      const productIds: string[] = (await Promise.all(
        updateSubscriptionPlanDto.products.map((product: ProductBaseDto) => {
          return this.productsService.createProduct(product, business);
        }))).map((product: ProductModel) => product._id);
      set.products = productIds;
    }

    if (updateSubscriptionPlanDto.categories) {
      const categories: string[] = (await Promise.all(
        updateSubscriptionPlanDto.categories.map((category: CategoryDto) => {
          return this.categoryService.createOrUpdate(category);
        }))).map((category: CategoryModel) => category._id);
      set.categories = categories;
    }

    if (updateSubscriptionPlanDto.subscribers) {
      const subscribers: string[] = (await Promise.all(
        updateSubscriptionPlanDto.subscribers.map((subscriber: CustomerPlanDto) => {
          return this.customerPlanService.create(subscriber);
        }))).map((subscriber: CustomerPlanModel) => subscriber._id);
      set.subscribers = subscribers;
    }

    if (updateSubscriptionPlanDto.subscribersGroups) {
      const subscribersGroups: string[] = (await Promise.all(
        updateSubscriptionPlanDto.subscribersGroups.map((subscribersGroup: SubscribersGroupHttpResponseDto) => {
          return this.customerGroupsService.create(subscribersGroup as SubscribersGroupModel);
        }))).map((subscribersGroup: SubscribersGroupModel) => subscribersGroup._id);
      set.subscribersGroups = subscribersGroups;
    }

    const subscriptionPlanNew: SubscriptionPlanModel = await this.subscriptionPlanModel.findOneAndUpdate(
      { _id: subscriptionPlan.id },
      {
        $set: set,
      },
      { new: true },
    );

    await subscriptionPlanNew.populate('products').populate({
      model: this.customerPlan,
      path: 'subscribers',
    }).execPopulate();

    await this.eventDispatcher.dispatch(
      SubscriptionPlanEventsEnum.SubscriptionPlanUpdated,
      subscriptionPlanNew,
    );

    return subscriptionPlanNew;
  }

  public async delete(subscriptionPlan: SubscriptionPlanModel): Promise<SubscriptionPlanModel> {

    const deletedSubscriptionPlan: SubscriptionPlanModel =
    await this.subscriptionPlanModel.findOneAndDelete({ _id: subscriptionPlan.id });

    await this.eventDispatcher.dispatch(
      SubscriptionPlanEventsEnum.SubscriptionPlanDeleted,
      deletedSubscriptionPlan,
    );

    return deletedSubscriptionPlan;
  }

  public async removeSubscriptionPlan(subscriptionPlan: SubscriptionPlanModel): Promise<SubscriptionPlanModel> {

    const deletedSubscriptionPlan: SubscriptionPlanModel =
    await this.subscriptionPlanModel.findByIdAndDelete(subscriptionPlan.id);

    await this.eventDispatcher.dispatch(
      SubscriptionPlanEventsEnum.SubscriptionPlanDeleted,
      deletedSubscriptionPlan,
    );

    return deletedSubscriptionPlan;
  }

  public async getSubscriptionPlansForProductsList(
    dto: RetreivePlansForProductsDto,
    business: BusinessModel,
  ): Promise<SubscriptionPlanModel[]> {
    const products: ProductModel[] = await this.productsService.getListForIds(dto.ids);

    return this.subscriptionPlanModel
      .find({
        businessId: business.id,
        products: {
          $in: products,
        },
      })
      .populate('products')
      .populate({
        model: this.customerPlan,
        path: 'subscribers',
      })
      .populate('business');
  }

  public async setDefault(subscriptionPlanId: string, businessId: string): Promise<SubscriptionPlanModel> {

    await this.subscriptionPlanModel.updateMany(
      {
        businessId,
      },
      {
        $set: {
          isDefault: false,
        },
      },
    );

    return this.subscriptionPlanModel.findOneAndUpdate(
      {
        _id: subscriptionPlanId,
      },
      {
        $set: {
          isDefault: true,
        },
      },
      {
        new: true,
      },
    );
  }

  public async removeSubscriptionPlansAndProduct(
    subscriptionPlans: SubscriptionPlanModel[],
    product: ProductModel,
  ): Promise<void> {
    for (const subscriptionPlan of subscriptionPlans) {
      const subscriptionPlanNew: SubscriptionPlanModel = await this.subscriptionPlanModel.findOneAndUpdate(
        { _id: subscriptionPlan.id },
        { $pull: { products: product._id } },
        { multi: true },
      );

      await this.eventDispatcher.dispatch(
        SubscriptionPlanEventsEnum.SubscriptionPlanDeleted,
        subscriptionPlanNew,
      );
    }
    await this.productsService.removeProduct(product);
  }

  public async getSubscriptionPlanByProduct(product: ProductModel): Promise<SubscriptionPlanModel[]> {
    return this.subscriptionPlanModel
      .find({
        products: {
          $in: product.id,
        },
      })
      .populate('products')
      .populate({
        model: this.customerPlan,
        path: 'subscribers',
      })
      .populate('business');
  }

  public async getById(id: string): Promise<SubscriptionPlanModel> {
    return this.subscriptionPlanModel
      .findOne({
        _id: id,
      })
      .populate({
        model: this.customerPlan,
        path: 'subscribers',
      })
      .populate('products');
  }

  public async getByBusiness(business: BusinessModel): Promise<SubscriptionPlanModel[]> {
    return this.subscriptionPlanModel
      .find({
        businessId: business.id,
      })
      .populate('products')
      .populate({
        model: this.customerPlan,
        path: 'subscribers',
      })
      .populate('business');
  }

  public async getForAdmin(query: SubscriptionNetworkQueryDto)
    : Promise<{ documents: SubscriptionPlanModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.business = { $in: query.businessIds };
    }

    const documents: SubscriptionPlanModel[] = await this.subscriptionPlanModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.subscriptionPlanModel.count(conditions).exec();

    return {
      documents,
      page,
      total,
    };
  }

  public async getPlanForBuilder(dto: SubscriptionPlanBuilderDto): Promise<SubscriptionPlanModel[]> {
    const filterData: any = dto.filter && dto.filter !== '' ? JSON.parse(dto.filter) : [];
    const queryBuilder: any = new QueryBuilder(PlanFilterFieldsMapping);
    const query: any = {
      businessId: dto.business as any,
      ...queryBuilder.buildQuery(filterData),
    };

    const offset: number = dto.offset ? dto.offset : 0;
    const limit: number = dto.limit ? dto.limit : 10;

    return this.subscriptionPlanModel.find(query)
      .limit(limit)
      .skip(offset)
      .populate('products');
  }

  public async removeSubscriptionPlansAndSubscriptionsByProduct(product: ProductModel): Promise<void> {
    const subscriptonPlans: SubscriptionPlanModel[]
        = await this.getSubscriptionPlanByProduct(product);

    if (subscriptonPlans.length === 0) {
        return ;
      }

    await this.removeSubscriptionPlansAndProduct(subscriptonPlans, product);
  }

  public async createPlansAndSubscriptionPlanForAllProductsByConnection(connection: ConnectionModel): Promise<void> {
    await connection.populate('business').execPopulate();
    const products: ProductModel[] = await this.productsService.getListForBusiness(connection.business);
    let promises: Array<Promise<any>> = [];
    const requestsLimit: number = 10;

    for (const product of products) {
      const subscriptionPlan: SubscriptionPlanModel
        = (await this.getSubscriptionPlanByProduct(product))[0];
      if (!subscriptionPlan) {
        continue;
      }
      if (!await this.connectionPlansService.isPlanExists(subscriptionPlan, connection)) {
        promises.push(this.connectionPlansService.create(subscriptionPlan, connection));
      }
      if (promises.length === requestsLimit) {
        await Promise.all(promises);
        promises = [];
      }
    }

    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  public async stopSubscriptionsAndRemovePlansAndSubscriptionPlanForConnection(
    connection: ConnectionModel,
  ): Promise<void> {
    await connection.populate('business').execPopulate();
    const products: ProductModel[] = await this.productsService.getListForBusiness(connection.business);
    let promises: Array<Promise<any>> = [];
    const requestsLimit: number = 10;

    for (const product of products) {
      const subscriptonPlan: SubscriptionPlanModel
        = (await this.getSubscriptionPlanByProduct(product))[0];
      if (!subscriptonPlan) {
        continue;
      }
      if (await this.connectionPlansService.isPlanExists(subscriptonPlan, connection)) {
        promises.push(this.connectionPlansService.deleteBySubscriptionPlanAndConnection(subscriptonPlan, connection));
      }
      if (promises.length === requestsLimit) {
        await Promise.all(promises);
        promises = [];
      }
    }

    if (promises.length) {
      await Promise.all(promises);
    }
  }
}
