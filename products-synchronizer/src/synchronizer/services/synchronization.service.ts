import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BusinessModel } from '@pe/business-kit';
import {
  CategoryTypeEnum,
  IntegrationModel,
  SynchronizationModel,
} from '@pe/synchronizer-kit';
import * as moment from 'moment';
import { Model } from 'mongoose';
import { SynchronizationDirectionEnum } from '../enums';
import {
  SynchronizationSchemaName,
} from '../schemas';

@Injectable()
export class SynchronizationService {
  constructor(
    @InjectModel(SynchronizationSchemaName)
    private readonly synchronizationModel: Model<SynchronizationModel>,
  ) { }

  public async enable(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    const existing: SynchronizationModel = await this.synchronizationModel.findOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
    ).exec();
    if (existing) {
      return;
    }

    return this.synchronizationModel.create({
      businessId: business.id,
      integration: integration.id,
    } as SynchronizationModel);
  }

  public async disable(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.remove({
      businessId: business.id,
      integration: integration.id,
    }).exec();
  }

  public async connect(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    const existing: SynchronizationModel = await this.synchronizationModel.findOne(
      {
        businessId: business._id,
        integration: integration._id,
      },
    ).exec();
    if (existing) {
      return existing;
    }

    const isSyncEnabled: boolean = this.isSyncEnabledByDefaultFor(integration);

    return this.synchronizationModel.findOneAndUpdate(
      {
        businessId: business.id,
        integration: integration.id,
      },
      {
        isInventorySyncEnabled: isSyncEnabled,
        isInwardEnabled: isSyncEnabled,
        isOutwardEnabled: isSyncEnabled,
        lastSynced: null,
      },
      {
        new: true,
        setDefaultsOnInsert: true,
        upsert: true,
      },
    );
  }

  public async disconnect(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    const existing: SynchronizationModel = await this.synchronizationModel.findOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
    ).exec();
    if (!existing) {
      return;
    }

    return this.synchronizationModel.updateOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
      {
        isInventorySyncEnabled: false,
        isInwardEnabled: false,
        isOutwardEnabled: false,
      },
    ).exec() as unknown as any;
  }

  public async toggleAllDirections(
    synchronization: SynchronizationModel,
    state: boolean,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findByIdAndUpdate(synchronization.id, {
      isInventorySyncEnabled: state,
      isInwardEnabled: state,
      isOutwardEnabled: state,
      lastSynced: null,
    }).exec();
  }

  public async toggleSyncDirection(
    business: BusinessModel,
    integration: IntegrationModel,
    direction: SynchronizationDirectionEnum,
    state: boolean,
  ): Promise<void> {
    let existing: SynchronizationModel = await this.synchronizationModel.findOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
    ).exec();
    if (!existing) {
      existing = await this.synchronizationModel.create({
        businessId: business.id,
        integration: integration.id,
      } as SynchronizationModel);
    }
    await this.toggleDirection(existing, direction, state);
  }

  public async toggleDirection(
    synchronization: SynchronizationModel,
    direction: SynchronizationDirectionEnum,
    state: boolean,
  ): Promise<void> {
    let update: { } = { };

    switch (direction) {
      case SynchronizationDirectionEnum.INWARD:
        update = {
          isInwardEnabled: state,
          lastSynced: null,
        };
        break;
      case SynchronizationDirectionEnum.OUTWARD:
        update = {
          isOutwardEnabled: state,
          lastSynced: null,
        };
        break;
    }

    await this.synchronizationModel.findByIdAndUpdate(
      synchronization.id,
      { $set: update },
    ).exec();
  }

  public async toggleSyncInventory(
    business: BusinessModel,
    integration: IntegrationModel,
    state: boolean,
  ): Promise<void> {
    let existing: SynchronizationModel = await this.synchronizationModel.findOne(
      {
        businessId: business.id,
        integration: integration.id,
      },
    ).exec();
    if (!existing) {
      existing = await this.synchronizationModel.create({
        businessId: business.id,
        integration: integration.id,
      } as SynchronizationModel);
    }
    await this.toggleInventory(existing, state);
  }

  public async toggleInventory(
    synchronization: SynchronizationModel,
    state: boolean,
  ): Promise<void> {
    const update: { } = {
      isInventorySyncEnabled: state,
      lastSynced: null,
    };

    await this.synchronizationModel.findByIdAndUpdate(
      synchronization.id,
      { $set: update },
    ).exec();
  }

  public async findById(id: string): Promise<SynchronizationModel> {
    return this.synchronizationModel.findById(id);
  }

  public async findAllBusinessOutwardings(
    business: BusinessModel,
  ): Promise<SynchronizationModel[]> {
    return this.synchronizationModel.find({
      businessId: business.id,
      isOutwardEnabled: true,
    });
  }

  public async findOneByBusinessAndIntegration(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findOne({
      businessId: business.id,
      integration: integration.id,
    });
  }

  public async findOneBusinessIntegrationInwarding(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findOne({
      businessId: business.id,
      integration: integration.id || integration._id,
      isInwardEnabled: true,
    });
  }

  public async findAllBusinessIntegrationsWithInventorySync(
    business: BusinessModel,
  ): Promise<SynchronizationModel[]> {
    return this.synchronizationModel.find({
      businessId: business.id,
      isInventorySyncEnabled: true,
    });
  }

  public async findOneBusinessIntegrationWithInventorySync(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findOne({
      businessId: business.id,
      integration: integration.id,
      isInventorySyncEnabled: true,
    });
  }

  public async findAllAwaitingSynchronization(
    limit: number,
    offset: number,
  ): Promise<SynchronizationModel[]> {

    const hasAnyEnabledIntegrationExp: any = {
      $or: [
        { isInwardEnabled: true },
        { isOutwardEnabled: true },
        { isInventorySyncEnabled: true },
      ],
    };

    return this.synchronizationModel.aggregate([
      {
        $addFields: {
          elapsedFromLastSync: {
            $subtract: [
              { $toLong: new Date() },
              { $toLong: { $ifNull: ['$lastSynced', 0] } },
            ],
          },
          finalSyncInterval: { $ifNull: ['$customSyncInterval', moment.duration(1, 'day').asMilliseconds()] },
        },
      },
      { $match: { $expr: { $gt: ['$elapsedFromLastSync', '$finalSyncInterval'] } } },
      { $match: hasAnyEnabledIntegrationExp },
      { $skip: offset },
      { $limit: limit },
    ]);
  }

  public async setLastSyncDate(
    synchronization: SynchronizationModel,
    lastSynced: Date,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findByIdAndUpdate(synchronization.id, {
      lastSynced,
    });
  }

  public async deleteAllByBusiness(business: BusinessModel): Promise<void> {
    await this.synchronizationModel.deleteMany({ businessId: business._id }).exec();
  }

  private isSyncEnabledByDefaultFor(integration: IntegrationModel): boolean {
    return (
      integration.category === CategoryTypeEnum.Shopsystems ||
      integration.name === 'external-inventory'
    );
  }
}
