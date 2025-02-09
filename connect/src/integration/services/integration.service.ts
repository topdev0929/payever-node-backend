import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, QueryCursor, QueryOptions } from 'mongoose';
import { countBy, Dictionary, each, find, map, maxBy, sumBy } from 'lodash';
import { fromEvent, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventDispatcher } from '@pe/nest-kit';
import { BusinessModelLocal } from '../../business';
import {
  AddIntegrationVersionDto, AdminIntegrationDto, EditIntegrationDto,
  IntegrationListDto, IntegrationDto, IntegrationQueryDto,
} from '../dto';
import { IntegrationModel, IntegrationVersionModel, RatingType } from '../models';
import { IntegrationReviewInterface, PendingInstallationInterface, SetupConnectInterface } from '../interfaces';
import { IntegrationEventsEnum } from '../enum';
import { PendingInstallationSchemaName } from '../schemas';
import { PendingInstallationModel } from '../models/pending-installation.model';
import { IntegrationSubscriptionService } from './integration-subscription.service';

@Injectable()
export class IntegrationService {

  constructor(
    @InjectModel('Integration')
    private readonly integrationModel: Model<IntegrationModel>,
    @InjectModel(PendingInstallationSchemaName)
      private readonly pendingInstallationModel: Model<PendingInstallationModel>,
    private readonly eventDispatcher: EventDispatcher,
    private readonly integrationSubscriptionService: IntegrationSubscriptionService,
  ) { }

  public findAllByBatch(batchSize: number): Observable<any> {
    const cursor: QueryCursor<IntegrationModel> = this.integrationModel
      .find({ })
      .cursor({ batchSize });

    return fromEvent(cursor, 'data')
      .pipe(
        takeUntil(
          fromEvent(cursor, 'end'),
        ),
      );
  }

  public async findAll(
    query?: IntegrationListDto,
  ): Promise<IntegrationModel[]> {
    const options: QueryOptions = {
      sort: {
        order: 1,
      },
    };

    if (query?.limit) {
      options.limit = query.limit;
    }
    if (query?.page) {
      options.skip = query.page - 1;
    }

    const parameters: any = {
      enabled: true,
    };

    if (query?.categories) {
      if (!Array.isArray(query.categories)) {
        query.categories = [query.categories];
      }
      parameters.category = { $in: query.categories };
    }

    return this.integrationModel
      .find(
        parameters,
        { },
        options,
      );
  }

  public async findByCategory(category: string): Promise<IntegrationModel[]> {
    const integrations: IntegrationModel[]
      = await this.integrationModel.find(
        {
          category: category,
          enabled: true,
        },
        { },
        {
          sort: {
            order: 1,
          },
        },
      );

    return integrations.sort((a: IntegrationModel, b: IntegrationModel) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });
  }

  public async findByWrapperType(wrapperType: string): Promise<IntegrationModel[]> {
    return this.integrationModel.find(
        {
          enabled: true,
          'installationOptions.wrapperType': wrapperType,
        },
        { },
        {
          sort: {
            order: 1,
          },
        },
      );
  }

  public async findOneById(integrationId: string): Promise<IntegrationModel> {
    return this.integrationModel.findById(integrationId);
  }

  public async findOneByName(integrationName: string, prepareForFrontend: boolean = false): Promise<IntegrationModel> {
    const integration: IntegrationModel = await this.integrationModel
      .findOne({ name: integrationName });

    if (integration && prepareForFrontend) {
      const ratingsPerRate: RatingType = this.getRatingsPerRate(integration.reviews);
      const ratingsSummary: number = sumBy(map(integration.reviews, 'rating'));
      integration.ratingsPerRate = ratingsPerRate;
      integration.ratingsCount = integration.reviews ? integration.reviews.length : 0;
      integration.avgRating = integration.ratingsCount > 0 ? ratingsSummary / integration.ratingsCount : 0;

      integration.latestVersion = maxBy(integration.versions, 'version');
      delete integration.versions;
    }

    return integration;
  }

  public async findOneByNameAndCategory(
    integrationName: string,
    integrationCategory: string,
  ): Promise<IntegrationModel> {
    return this.integrationModel
      .findOne({ name: integrationName, category: integrationCategory });
  }

  public async getForAdmin(query: IntegrationQueryDto)
    : Promise<{ documents: IntegrationModel[]; page: number; total: number }> {

    const limit: number = query.limit || 100;
    const page: number = query.page || 1;
    const sort: any = query.sort || { createdAt: 1 };
    const skip: number = (page - 1) * limit;

    const conditions: any = { };

    const documents: IntegrationModel[] = await this.integrationModel
      .find(conditions)
      .select(query.projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();

    const total: number = await this.integrationModel.count(conditions);

    return {
      documents,
      page,
      total,
    };
  }

  public async updateForAdmin(id: string, dto: AdminIntegrationDto)
    : Promise<IntegrationModel> {
    await this.integrationModel.findByIdAndUpdate(id, dto as IntegrationModel);
    const integration: IntegrationModel = await this.integrationModel.findById(id);
    await this.eventDispatcher.dispatch(IntegrationEventsEnum.IntegrationUpdated, integration);

    return integration;
  }

  public async deleteForAdmin(id: string)
    : Promise<IntegrationModel> {
    return this.integrationModel.findByIdAndDelete(id);
  }

  public async addAllowedBusiness(integrationModelId: string, allowedBusinessIds: string[])
    : Promise<IntegrationModel> {
    const integration: IntegrationModel = await this.integrationModel.findById({ _id: integrationModelId });
    integration.allowedBusinesses = integration.allowedBusinesses || [];
    for (const allowedBusinessId of allowedBusinessIds) {
      if (!integration.allowedBusinesses.find((id: string) => id === allowedBusinessId)) {
        integration.allowedBusinesses.push(allowedBusinessId);
      }
    }
    await this.integrationModel.findByIdAndUpdate(integrationModelId, integration);

    return this.integrationModel.findById(integrationModelId);
  }


  public async removeAllowedBusiness(integrationModelId: string, allowedBusinessIds: string[])
    : Promise<IntegrationModel> {
    const integration: IntegrationModel = await this.integrationModel.findById({ _id: integrationModelId });
    integration.allowedBusinesses = integration.allowedBusinesses || [];
    integration.allowedBusinesses = integration
      .allowedBusinesses
      .filter((businessId: string) => allowedBusinessIds.indexOf(businessId) === -1);
    await this.integrationModel.findByIdAndUpdate(integrationModelId, integration);

    return this.integrationModel.findById(integrationModelId);
  }


  public async create(data: AdminIntegrationDto): Promise<IntegrationModel> {
    const integration: IntegrationModel = await this.integrationModel.create(data as IntegrationModel);
    await this.eventDispatcher.dispatch(IntegrationEventsEnum.IntegrationCreated, integration);

    return integration;
  }

  public async upsert(data: IntegrationDto): Promise<IntegrationModel> {
    const existingIntegration: IntegrationModel = await this.integrationModel.findOne({
      $or: [{ _id: data._id }, { name: data.name }],
    });

    if (existingIntegration) {
      data._id = existingIntegration._id;
    }

    const integration: IntegrationModel = await this.integrationModel.findOneAndUpdate(
      {
        _id: data._id,
      },
      {
        $set: data,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );

    await this.eventDispatcher.dispatch(IntegrationEventsEnum.IntegrationUpdated, integration);

    return integration;
  }

  public async addReview(integration: IntegrationModel, review: IntegrationReviewInterface): Promise<IntegrationModel> {
    if (!integration.reviews) {
      integration.reviews = new Types.DocumentArray([]);
    }

    const existingReview: any = find(integration.reviews, { userId: review.userId });
    if (!existingReview) {
      integration.reviews.push(review);
    } else {
      existingReview.reviewDate = review.reviewDate;
      existingReview.text = review.text;
      existingReview.title = review.title;
      existingReview.rating = review.rating;
    }

    return this.integrationModel.findOneAndUpdate(
      { _id: integration._id },
      { $set: { reviews: integration.reviews } })
      .exec();
  }

  public async addRating(integration: IntegrationModel, rating: IntegrationReviewInterface): Promise<IntegrationModel> {
    if (!integration.reviews) {
      integration.reviews = new Types.DocumentArray([]);
    }

    const existingReview: any = find(integration.reviews, { userId: rating.userId });
    if (!existingReview) {
      integration.reviews.push(rating);
    } else {
      existingReview.rating = rating.rating;
    }

    return this.integrationModel.findOneAndUpdate(
      { _id: integration._id },
      { $set: { reviews: integration.reviews } })
      .exec();
  }

  public async incrementInstallCounter(integration: IntegrationModel): Promise<void> {
    if (integration.timesInstalled) {
      integration.timesInstalled++;
    } else {
      integration.timesInstalled = 1;
    }

    await this.integrationModel.updateOne(
      { _id: integration._id },
      { $set: { timesInstalled: integration.timesInstalled } })
      .exec();
  }

  public async edit(integrationId: string, dto: EditIntegrationDto): Promise<IntegrationModel> {
    const integration: IntegrationModel = await this.integrationModel.findByIdAndUpdate(
      integrationId,
      { $set: dto },
      { new: true },
    );
    await this.eventDispatcher.dispatch(IntegrationEventsEnum.IntegrationUpdated, integration);

    return integration;
  }

  public async addVersion(integration: IntegrationModel, version: AddIntegrationVersionDto): Promise<void> {
    if (!integration.versions) {
      integration.versions = new Types.DocumentArray([]);
    }

    const existingVersion: IntegrationVersionModel = find(integration.versions, { _id: version._id });
    if (existingVersion) {
      existingVersion.version = version.version;
      existingVersion.description = version.description;
    } else {
      integration.versions.push(version);
    }

    await this.integrationModel.updateOne(
      { _id: integration._id },
      { $set: { versions: integration.versions } })
      .exec();
  }

  private getRatingsPerRate(reviews: any): RatingType {
    const ratingsPerRate: RatingType = {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    };

    const counted: Dictionary<number> = countBy(reviews, 'rating');

    each(counted, (v: number, k: string) => {
      ratingsPerRate[k] = v;
    });

    return ratingsPerRate;
  }

  public async addPendingInstallation(data: PendingInstallationInterface): Promise<void> {
    await this.pendingInstallationModel.create(data);
  }

  public async processPendingInstallment(business: BusinessModelLocal): Promise<void> {
    const pendingInstallation: PendingInstallationModel =
    await this.pendingInstallationModel.findOne({ businessId: business._id });

    if (!pendingInstallation) {
      return;
    }
    await this.setupConnection(pendingInstallation.payload, business);
    await this.pendingInstallationModel.deleteOne({ businessId: business._id });
  }

  public async findByName(integrationName: string): Promise<IntegrationModel> {
    return this.integrationModel.findOne({ name: integrationName });
  }

  public async setupConnection(
    data: SetupConnectInterface,
    business: BusinessModelLocal,
  ): Promise<void> {
    const { integrationsToInstall }: any = data;

    for (const integrationName of integrationsToInstall) {
      const integration: IntegrationModel = await this.findByName(integrationName);
      await this.integrationSubscriptionService.install(integration, business);
    }
  }
}
