import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BusinessModel } from '../../business/models';
import { IntegrationModel, IntegrationSubscriptionModel } from '../../integration/models';
import { FailureReasonDto } from '../dto/failure-reason.dto';
import { ShippingTaskStatusEnum } from '../enums/shipping-task-status.enum';
import { SyncEventInterface } from '../interfaces/sync-event-interface';
import { ShippingTaskModel } from '../models/shipping-task.model';
import { ShippingTaskSchemaName } from '../schemas/shipping-task.schema';

@Injectable()
export class ShippingTaskService {
  constructor(
    @InjectModel(ShippingTaskSchemaName)
    private readonly shippingTaskModel: Model<ShippingTaskModel>,
  ) { }

  public async createFromShipping(
    integrationSubscription: IntegrationSubscriptionModel,
    business: BusinessModel,
  ): Promise<ShippingTaskModel> {
    return this.shippingTaskModel.create({
      businessId: business._id,
      errorsList: [],
      events: [],
      integration: integrationSubscription.integration,
      itemsSynced: 0,
      status: ShippingTaskStatusEnum.IN_QUEUE,
    } as ShippingTaskModel);
  }

  public async getOne(id: string): Promise<ShippingTaskModel> {
    return this.shippingTaskModel.findById(id);
  }

  public async getOldUnfinished(lastUpdate: Date): Promise<ShippingTaskModel[]> {
    return this.shippingTaskModel.find({
      status: {
        $in: [ShippingTaskStatusEnum.IN_PROGRESS, ShippingTaskStatusEnum.IN_QUEUE],
      },
      updatedAt: {
        $lte: lastUpdate,
      },
    });
  }

  public async getByBusinessAndIntegration(
    business: BusinessModel,
    integration: IntegrationModel,
  ): Promise<ShippingTaskModel[]> {
    return this.shippingTaskModel
      .find({ businessId: business.id, integration: integration.id })
      .sort({ startedAt: -1 });
  }

  public async getByBusiness(businessId: string, filter?: object): Promise<ShippingTaskModel[]> {
    return this.shippingTaskModel
      .find(applyFilter({ businessId: businessId }, filter))
      .sort({ startedAt: -1 });
  }

  public async getEvents(task: ShippingTaskModel): Promise<SyncEventInterface[]> {
    const selected: ShippingTaskModel = await this.shippingTaskModel
      .findOne({ _id: task.id })
      .select('events').exec()
    ;

    return selected && selected.events ? selected.events : [];
  }

  public async taskSuccess(task: ShippingTaskModel): Promise<void> {
    await this.shippingTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        status: ShippingTaskStatusEnum.SUCCEES,
      },
      { new: true },
    ).exec();
  }

  public async taskFail(task: ShippingTaskModel, reason: FailureReasonDto): Promise<void> {
    await this.shippingTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        errorsList: [{ messages: [reason.errorMessage] }],
        failureReason: reason,
        status: ShippingTaskStatusEnum.FAILURE,
      },
      { new: true },
    ).exec();
  }

  public async taskInProgress(task: ShippingTaskModel): Promise<void> {
    await this.shippingTaskModel.findOneAndUpdate(
      {
        _id: task.id,
      },
      {
        status: ShippingTaskStatusEnum.IN_PROGRESS,
      },
    ).exec();
  }
}

function applyFilter(conditions: object, filter: object): object {
  if (filter) {
    for (const [k, v] of Object.entries(filter)) {
      if (v) {
        conditions[k] = v;
      }
    }
  }

  return conditions;
}
