import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ActionApiCallSchemaName, ApiCallSchemaName } from '../schemas';
import { ActionApiCallModel, ApiCallModel } from '../models';
import { ActionApiCallEventDto, ApiCallEventDto } from '../dto/api-call';
import { classToPlain } from 'class-transformer';
import { Mutex } from '@pe/nest-kit';

@Injectable()
export class ApiCallService {
  constructor(
    @InjectModel(ApiCallSchemaName) private readonly apiCallModel: Model<ApiCallModel>,
    @InjectModel(ActionApiCallSchemaName) private readonly actionApiCallModel: Model<ActionApiCallModel>,
    private readonly mutex: Mutex,
  ) { }

  public async createOrUpdateApiCallFromEvent(data: ApiCallEventDto): Promise<ApiCallModel> {
    const plainApiCall: any = classToPlain(data);
    plainApiCall.executionTime = ApiCallService.executionTimeStringToNumber(data.executionTime);

    return this.mutex.lock(
      'checkout-analytics-api-call',
      plainApiCall.id,
      async () => this.apiCallModel.findOneAndUpdate(
        { _id: plainApiCall.id },
        { $set: plainApiCall },
        { new: true, upsert: true },
      ),
    );
  }

  public async createOrUpdateActionApiCallFromEvent(data: ActionApiCallEventDto): Promise<ApiCallModel> {
    const plainApiCall: any = classToPlain(data);
    plainApiCall.executionTime = ApiCallService.executionTimeStringToNumber(data.executionTime);

    return this.mutex.lock(
      'checkout-analytics-action-api-call',
      plainApiCall.id,
      async () => this.actionApiCallModel.findOneAndUpdate(
        { _id: plainApiCall.id },
        { $set: plainApiCall },
        { new: true, upsert: true },
      ),
    );
  }

  private static executionTimeStringToNumber(executionTime?: string): number {
    if (!executionTime) {
      return null;
    }

    const matches: string[] = executionTime.match(/([\d]+)s ([\d\.]+)ms/);
    const sec: number = parseInt(matches[1], 10);
    const ms: number = parseFloat(matches[2]);

    return Math.round(((sec * 1000) + ms + Number.EPSILON) * 100) / 100;
  }
}
