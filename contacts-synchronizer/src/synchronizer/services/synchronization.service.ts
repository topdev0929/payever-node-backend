import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { BusinessModel } from '@pe/business-kit';
import { SynchronizationModel } from '../models';
import {
  SynchronizationSchemaName,
} from '../schemas';

@Injectable()
export class SynchronizationService {
  constructor(
    @InjectModel(SynchronizationSchemaName)
      private readonly synchronizationModel: Model<SynchronizationModel>,
  ) { }

  public async findAllBusinessOutwardings(
    business: BusinessModel,
  ): Promise<SynchronizationModel[]> {
    return this.synchronizationModel.find({
      businessId: business.id,
      isOutwardEnabled: true,
    });
  }

  public async enable(
    businessId: string,
    integrationId: string,
  ): Promise<SynchronizationModel> {
    return await this.synchronizationModel.findOne({
      businessId: businessId,
      integrationId: integrationId,
    }) || this.synchronizationModel.create({
      businessId: businessId,
      integrationId: integrationId,
    });
  }

  public async disable(
    businessId: string,
    integrationId: string,
  ): Promise<SynchronizationModel> {
    return this.synchronizationModel.findOneAndRemove({
      businessId: businessId,
      integrationId: integrationId,
    });
  }

  public async setSyncDirectionsState(
    businessId: string,
    integrationId: string,
    isInwardEnabled: boolean,
    isOutwardEnabled: boolean,
  ): Promise<void> {
    let updateQuery: UpdateQuery<SynchronizationModel> = {
      lastSynced: null,
    };
    if (typeof isInwardEnabled === 'boolean') {
      updateQuery = { ...updateQuery, isInwardEnabled };
    }
    if (typeof isOutwardEnabled === 'boolean') {
      updateQuery = { ...updateQuery, isOutwardEnabled };
    }
    const synchronization: SynchronizationModel = await this.enable(businessId, integrationId);
    await this.synchronizationModel.findByIdAndUpdate(synchronization._id, updateQuery);
  }
}
