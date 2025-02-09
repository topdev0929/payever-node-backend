import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryCursor } from 'mongoose';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { BusinessModelLocal } from '../../business';
import { IntegrationSubscriptionInterface, IntegrationPaginationInterface } from '../interfaces';
import { CategoryModel, IntegrationModel, IntegrationSubscriptionModel } from '../models';
import { EventProducer } from '../producer';
import { CategoryService } from './category.service';
import { IntegrationSubscriptionListDto, IntegrationSubscriptionQueryDto } from '../dto';
import { IntegrationSubscriptionEventsEnum } from '../enum';
import { EventDispatcher, Mutex } from '@pe/nest-kit';
import { AdminIntegrationSubscriptionDto } from '../dto/admin-integration-subscription.dto';
import { FoldersElasticSearchService } from '@pe/folders-plugin';

@Injectable()
export class IntegrationSubscriptionService {
  constructor(
    @InjectModel('Integration')
    private readonly integrationModel: Model<IntegrationModel>,
    @InjectModel('IntegrationSubscription')
    private readonly subscriptionModel: Model<IntegrationSubscriptionModel>,
    @InjectModel('Business')
    private readonly businessModel: Model<BusinessModelLocal>,
    private readonly foldersElasticSearchService: FoldersElasticSearchService,
    private readonly eventsProducer: EventProducer,
    private readonly categoryService: CategoryService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly mutex: Mutex,
    private readonly logger: Logger,
  ) { }

  public async install(
    integration: IntegrationModel,
    business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel> {

    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(
      integration,
      business,
    );


    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel
      .findByIdAndUpdate(
        subscription.id,
        {
          installed: true,
          scopes: integration.scopes,
        },
        {
          new: true,
        },
      );

    await updatedSubscription.populate('integration').execPopulate();

    await this.eventsProducer.sendThirdPartyEnabledDisabledMessage(
      business,
      integration,
      'connect.event.third-party.enabled',
    );
    await this.eventDispatcher.dispatch(
      IntegrationSubscriptionEventsEnum.IntegrationSubscriptionUpdated,
      business,
      updatedSubscription,
    );

    return updatedSubscription;
  }

  public async uninstall(
    integration: IntegrationModel,
    business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel> {
    const subscription: IntegrationSubscriptionModel = await this.findOrCreateSubscription(
      integration,
      business,
    );

    const updatedSubscription: IntegrationSubscriptionModel = await this.subscriptionModel
      .findByIdAndUpdate(
        subscription.id,
        {
          $set: { installed: false },
          $unset: { payload: '' },
        },
        { new: true },
      )
      .exec();
    await updatedSubscription.populate('integration').execPopulate();

    await this.eventsProducer.sendThirdPartyEnabledDisabledMessage(
      business,
      integration,
      'connect.event.third-party.disabled',
    );
    await this.eventDispatcher.dispatch(
      IntegrationSubscriptionEventsEnum.IntegrationSubscriptionUpdated,
      business,
      updatedSubscription,
    );

    return updatedSubscription;
  }

  public async filterNotInstalledByCountry(
    business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel[]> {
    let integrations: IntegrationSubscriptionModel[] = await this.findNotInstalled(business);

    integrations = integrations.filter((record: IntegrationSubscriptionModel) => {
      return (
        record?.integration?.installationOptions?.countryList &&
        (record.integration.installationOptions.countryList.length === 0 ||
          record.integration.installationOptions.countryList.indexOf(
            business.country,
          ) > -1)
      );
    });

    return Promise.resolve(integrations);
  }

  public async findNotInstalled(
    business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel[]> {
    await this.initBusinessSubscriptions(business);

    return this.findBusinessSubscriptions(business._id, {
      installed: false,
    });
  }

  public async findOneByIntegrationAndBusiness(
    integration: IntegrationModel,
    business: BusinessModelLocal,
  ): Promise<IntegrationSubscriptionModel> {
    return this.findOrCreateSubscription(integration, business);
  }

  public async findByCategory(
    business: BusinessModelLocal,
    category: string,
  ): Promise<IntegrationSubscriptionModel[]> {
    return (await this.getBusinessIntegrationSubscriptions(business)).filter(
      (record: IntegrationSubscriptionModel) => record.integration.category === category,
    ).sort(this.sortSubscriptionsByIntegrationName.bind(this));
  }

  public async findByBusinessList(
    business: BusinessModelLocal,
    query: IntegrationSubscriptionListDto,
  ): Promise<IntegrationPaginationInterface> {

    if (query.categories && !Array.isArray(query.categories)) {
      query.categories = [query.categories];
    }
    if (query.containName && !Array.isArray(query.containName)) {
      query.containName = [query.containName];
    }
    if (query.notContainName && !Array.isArray(query.notContainName)) {
      query.notContainName = [query.notContainName];
    }

    const integrations: IntegrationSubscriptionModel[] = await
      this.getBusinessIntegrationSubscriptions(business, query.active, query);

    const limit: number = query.limit ? query.limit : 10;
    const skip: number = query.page ? (query.page - 1) * limit : 0;

    const total: number = integrations.length;

    return {
      integrations: integrations.splice(skip, limit),
      total,
    };
  }

  public async getForAdmin(
    query: IntegrationSubscriptionQueryDto,
  ): Promise<{ documents: IntegrationSubscriptionModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    if (query.businessIds) {
      conditions.businessId = { $in: Array.isArray(query.businessIds) ? query.businessIds : [query.businessIds] };
    }

    if (query.instegrations) {
      conditions.instegration = {
        $in: Array.isArray(query.instegrations) ? query.instegrations : [query.instegrations],
      };
    }

    if (query.installed !== undefined) {
      conditions.installed = query.installed;
    }

    const documents: IntegrationSubscriptionModel[] = await this.subscriptionModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.subscriptionModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async createForAdmin(
    dto: AdminIntegrationSubscriptionDto,
  ): Promise<IntegrationSubscriptionModel> {
    return this.subscriptionModel.create(dto);
  }

  public async updateForAdmin(
    id: string,
    dto: AdminIntegrationSubscriptionDto,
  ): Promise<IntegrationSubscriptionModel> {
    await this.subscriptionModel.findByIdAndUpdate(id, dto);

    return this.subscriptionModel.findById(id);
  }

  public async deleteForAdmin(id: string): Promise<IntegrationSubscriptionModel> {
    return this.subscriptionModel.findByIdAndDelete(id);
  }


  public async getBusinessIntegrationSubscriptions(
    business: BusinessModelLocal,
    activeOnly: boolean = false,
    query?: IntegrationSubscriptionListDto,
  ): Promise<IntegrationSubscriptionModel[]> {
    business = await this.initBusinessSubscriptions(business);

    const categories: any = await this.findCategoryIconMap();
    const uniqueIntegrations: string[] = [];

    let subscriptions: IntegrationSubscriptionModel[] = await this.findBusinessSubscriptions(business._id);

    subscriptions = subscriptions.filter(
      (record: IntegrationSubscriptionModel) => {

        if (!this.isIntegrationAllowed(business, record.integration)) {
          return false;
        }

        if (activeOnly && record.installed === false) {
          return false;
        }

        if (uniqueIntegrations.includes(record.integration.name) || !record.integration.enabled) {
          return false;
        }

        if (!record.integration.categoryIcon && categories[record.integration.category]) {
          record.integration.categoryIcon = categories[record.integration.category];
        }

        uniqueIntegrations.push(record.integration.name);

        return true;
      });

    subscriptions = this.filterWithCategory(subscriptions, query);
    subscriptions = this.filterWithNotContainName(subscriptions, query);
    subscriptions = this.filterWithContainName(subscriptions, query);

    return subscriptions.sort(this.sortSubscriptionsByIntegrationOrder.bind(this));
  }

  public async findBusinessSubscriptions(businessId: string, filter?: any): Promise<IntegrationSubscriptionModel[]> {
    const subscriptions: IntegrationSubscriptionModel[] = await this.subscriptionModel.find({
      businessId,
      ...filter,
    });

    for (const subscription of subscriptions) {
      await subscription.populate('integration').execPopulate();
    }

    return subscriptions;
  }

  public async findByIds(
    ids: string[],
  ): Promise<IntegrationSubscriptionModel[]> {

    return this.subscriptionModel.find({
      _id: { $in: ids },
    });
  }

  public async remove(subscription: IntegrationSubscriptionModel): Promise<any> {
    if (!subscription.id) {
      return;
    }
    await this.subscriptionModel.deleteOne({ _id: subscription.id });
    await this.eventDispatcher.dispatch(
      IntegrationSubscriptionEventsEnum.IntegrationSubscriptionRemoved,
      subscription,
    );
  }

  public async findBusinessBySubscription(
    subscription: IntegrationSubscriptionModel,
  ): Promise<BusinessModelLocal> {
    return this.businessModel.findOne({ _id: subscription.businessId });
  }

  public findAllByCategory(category: string, batchSize: number): Observable<any> {
    const cursor: QueryCursor<IntegrationSubscriptionModel> = this.subscriptionModel
      .find({ })
      .where('integration').ne(null)
      .populate({
        match: { category: { $eq: category } },
        path: 'integration',
      })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }

  public findAllByBatch(batchSize: number): Observable<any> {
    const cursor: QueryCursor<IntegrationSubscriptionModel> = this.subscriptionModel
      .find({ })
      .where('integration').ne(null)
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }

  public findAllByCriteria(batchSize: number, criteria: any): Observable<any> {
    const cursor: QueryCursor<IntegrationSubscriptionModel> = this.subscriptionModel
      .find(criteria)
      .populate({ path: 'integration' })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }

  public findAllBusiness(batchSize: number): Observable<any> {
    const cursor: QueryCursor<BusinessModelLocal> = this.businessModel
      .find({ })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }

  public filterWithCategory(
    subscriptions: IntegrationSubscriptionModel[],
    query: any,
  ): IntegrationSubscriptionModel[] {
    return subscriptions.filter(
      (record: IntegrationSubscriptionModel) => {
        if (!record.integration) {
          return false;
        }

        return !(query &&
          query.categories &&
          query.categories.length &&
          !query.categories.includes(record.integration.category));
      },
    );
  }

  public filterWithNotContainName(
    subscriptions: IntegrationSubscriptionModel[],
    query: any,
  ): IntegrationSubscriptionModel[] {
    return subscriptions.filter(
      (record: IntegrationSubscriptionModel) => {
        if (!record.integration) {
          return false;
        }

        if (
          query &&
          query.notContainName &&
          query.notContainName.length
        ) {
          const name: string = record.integration.name.toLowerCase().replace(/_/g, ' ');
          for (const nameFilter of query.notContainName) {
            if (name.includes(nameFilter.toLowerCase())) {
              return false;
            }
          }
        }

        return true;
      },
    );
  }

  public filterWithContainName(
    subscriptions: IntegrationSubscriptionModel[],
    query: any,
  ): IntegrationSubscriptionModel[] {
    return subscriptions.filter(
      (record: IntegrationSubscriptionModel) => {
        if (!record.integration) {
          return false;
        }

        return this.isIncluded(record, query);
      },
    );
  }

  public async initBusinessSubscriptions(business: BusinessModelLocal): Promise<BusinessModelLocal> {
    const integrations: IntegrationModel[] = await this.integrationModel.find();
    const subscriptions: IntegrationSubscriptionModel[] = await this.findBusinessSubscriptions(business._id);

    for (const integration of integrations) {

      // is allowed
      const allowedBusiness: boolean = (integration.allowedBusinesses && integration.allowedBusinesses.length)
        ? integration.allowedBusinesses.includes(business._id)
        : true;

      // isn't excluded
      const notExcludedIntegration: boolean = (business.excludedIntegrations && business.excludedIntegrations.length)
        ? !business.excludedIntegrations.includes(integration._id)
        : true;

      const subscribed: boolean = subscriptions.findIndex(
        (sub: IntegrationSubscriptionModel) => sub.integration === integration._id,
      ) > -1;

      if (allowedBusiness && notExcludedIntegration && !subscribed) {
        await this.findOrCreateSubscription(integration, business, false);
      }
    }

    return business;
  }

  public async findSubscription(
    integration: string,
    businessId: string,
  ): Promise<IntegrationSubscriptionModel> {

    return this.subscriptionModel.findOne(
      {
        businessId: businessId,
        integration: integration,
      } as any,
    );
  }

  public async findOrCreateSubscription(
    integration: IntegrationModel,
    business: BusinessModelLocal,
    populate: boolean = true,
  ): Promise<IntegrationSubscriptionModel> {

    let subscription: IntegrationSubscriptionModel = await this.subscriptionModel.findOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
    );

    if (!subscription) {
      const subscriptionDto: IntegrationSubscriptionInterface = {
        businessId: business.id,
        installed: false,
        integration: integration.id,
      };

      const rawResult: any = await this.mutex.lock(
        'connect-integration-subscription',
        `${business._id}-${integration._id}`,
        async () => this.subscriptionModel.findOneAndUpdate(
          { businessId: business.id, integration: integration.id },
          {
            $set: subscriptionDto,
            $setOnInsert: {
              _id: uuid(),
            },
          },
          { new: true, upsert: true, rawResult: true },
        ),
      );

      subscription = rawResult.value as IntegrationSubscriptionModel;

      if (rawResult.lastErrorObject.updatedExisting === false) {
        await this.eventDispatcher.dispatch(
          IntegrationSubscriptionEventsEnum.IntegrationSubscriptionCreated,
          business,
          subscription,
        );
      }
    }

    if (populate) {
      await subscription.populate('integration').execPopulate();
    }

    return subscription;
  }

  private async isIncluded(
    record: IntegrationSubscriptionModel,
    query: any,
  ): Promise<boolean> {
    if (
      query &&
      query.containName &&
      query.containName.length
    ) {
      const name: string = record.integration.name.toLowerCase().replace(/_/g, ' ');
      const title: string = record.integration.displayOptions?.title?.toLowerCase().replace(/_/g, ' ') || '';
      let contains: boolean = false;
      for (const nameFilter of query.containName) {
        if (name.includes(nameFilter.toLowerCase()) || title.includes(nameFilter.toLowerCase())) {
          contains = true;
        }
      }
      if (!contains) {
        return false;
      }
    }

    return true;
  }

  private sortSubscriptionsByIntegrationName(
    a: IntegrationSubscriptionInterface,
    b: IntegrationSubscriptionInterface,
  ): number {
    if (a.integration.name < b.integration.name) {
      return -1;
    }

    if (a.integration.name > b.integration.name) {
      return 1;
    }

    return 0;
  }

  private sortSubscriptionsByIntegrationOrder(
    a: IntegrationSubscriptionInterface,
    b: IntegrationSubscriptionInterface,
  ): number {
    if (a.integration.order < b.integration.order) {
      return -1;
    }

    if (a.integration.order > b.integration.order) {
      return 1;
    }

    return 0;
  }

  private async findCategoryIconMap(): Promise<any> {
    const categories: CategoryModel[] = await this.categoryService.findAll();

    const data: any = { };

    for (const category of categories) {
      data[category.name] = category.icon;
    }

    return data;
  }

  private isIntegrationAllowed(
    business: BusinessModelLocal,
    integration: IntegrationModel,
  ): boolean {

    if (!integration) {
      return false;
    }

    // is allowed
    if (
      integration.allowedBusinesses?.length &&
      !integration.allowedBusinesses.includes(business._id)
    ) {
      return false;
    }

    // isn't excluded
    return !(business.excludedIntegrations?.length &&
      business.excludedIntegrations.includes(integration._id));
  }
}
