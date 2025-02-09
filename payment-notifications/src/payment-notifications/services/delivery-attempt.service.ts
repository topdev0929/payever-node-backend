import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeliveryAttemptModel } from '../models';
import { DeliveryAttemptSchemaName } from '../schemas';
import { DeliveryAttemptDto } from '../dto';
import { PaymentNotificationStatusesEnum } from '../enums';

@Injectable()
export class DeliveryAttemptService {
  constructor(
    @InjectModel(DeliveryAttemptSchemaName)
    private readonly deliveryAttemptModel: Model<DeliveryAttemptModel>,
  ) { }

  public async createDeliveryAttempt(notificationId: string): Promise<DeliveryAttemptModel> {
    return this.deliveryAttemptModel.create({
      notificationId: notificationId,
      status: PaymentNotificationStatusesEnum.STATUS_NEW,
    });
  }

  public async updateDeliveryAttempt(
    deliveryAttemptId: string,
    deliveryAttemptDto: DeliveryAttemptDto,
  ): Promise<DeliveryAttemptModel> {
    return this.deliveryAttemptModel.findOneAndUpdate(
      { _id: deliveryAttemptId },
      deliveryAttemptDto,
      { new: true },
    );
  }
}
