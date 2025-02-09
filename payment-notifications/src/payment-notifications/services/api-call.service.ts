import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiCallModel } from '../models';
import { ApiCallSchemaName } from '../schemas';
import { classToPlain } from 'class-transformer';
import { ApiCallDto } from '../dto';

const PAYMENT_ID_PATTERN: string = '--PAYMENT-ID--';
const API_CALL_ID_PATTERN: string = '--CALL-ID--';

@Injectable()
export class ApiCallService {
  constructor(
    @InjectModel(ApiCallSchemaName)
    private readonly apiCallModel: Model<ApiCallModel>,
  ) { }

  public async create(apiCall: ApiCallDto): Promise<ApiCallModel> {
    const plainApiCall: any = classToPlain(apiCall);
    plainApiCall._id = apiCall.id;

    return this.apiCallModel.create(plainApiCall);
  }

  public async updateFromExport(apiCall: ApiCallDto): Promise<ApiCallModel> {
    const plainApiCall: any = classToPlain(apiCall);
    plainApiCall._id = apiCall.id;

    return this.apiCallModel.findOneAndUpdate(
      { _id: plainApiCall._id },
      { $set: plainApiCall },
      { upsert: true },
    );
  }

  public async findByApiCallId(id?: string): Promise<ApiCallModel> {
    if (!id) {
      return null;
    }

    return this.apiCallModel.findOne({
      _id: id,
    });
  }

  public async applyPaymentId(apiCallId?: string, paymentId?: string): Promise<void> {
    if (!apiCallId || !paymentId) {
      return;
    }

    await this.apiCallModel.updateOne(
      { _id: apiCallId },
      { paymentId: paymentId },
    );
  }

  public modifyCallbackUrl(url?: string, apiCallId?: string, paymentId?: string): string {
    if (!url) {
      return null;
    }

    if (apiCallId) {
      url = url.replace(API_CALL_ID_PATTERN, apiCallId);
    }

    if (paymentId) {
      url = url.replace(PAYMENT_ID_PATTERN, paymentId);
    }

    return url;
  }
}
