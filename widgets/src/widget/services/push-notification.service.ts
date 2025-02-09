import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EventDispatcher } from '@pe/nest-kit';
import { Model } from 'mongoose';
import { PushNotificationDto } from '../dto';
import { PushNotificationEnum } from '../enums/push-notification.enum';
import { PushNotificationModel } from '../models';
import { PushNotificationSchemaName } from '../schemas';

@Injectable()
export class PushNotificationService {

  constructor(
    @InjectModel(PushNotificationSchemaName)
    private readonly pushNotificationModel: Model<PushNotificationModel>,
    private readonly eventDispatcher: EventDispatcher,
  ) { }


  public async getAll(): Promise<PushNotificationDto[]> {
    return this.pushNotificationModel.find();
  }

  public async create(dto: PushNotificationDto): Promise<PushNotificationDto> {
    return this.pushNotificationModel.create(dto);
  }

  public async update(id: string, dto: Partial<PushNotificationDto>): Promise<PushNotificationDto> {
    return this.pushNotificationModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...dto,
        },
      },
      { new: true },
    );
  }

  public async delete(pushNotification: PushNotificationModel): Promise<PushNotificationDto> {
    return pushNotification.delete();
  }

  public async push(pushNotification: PushNotificationModel): Promise<PushNotificationDto> {
    await this.eventDispatcher.dispatch(
      PushNotificationEnum.send,
      pushNotification,
    );

    return pushNotification;
  }
}
