import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorNotificationSchemaName } from '../schemas';
import { ErrorNotificationModel } from '../models';
import {
  ErrorNotificationEventDto,
  ErrorNotificationAggregateDto, SettingsDto,
} from '../dto';
import { SendingByCronUpdateIntervalErrorTypes, SendingByAfterIntervalErrorTypes } from '../constants';
import { ErrorNotificationTypesEnum } from '../enums';
import { SettingsService } from './settings.service';

@Injectable()
export class ErrorNotificationService {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly logger: Logger,
    @InjectModel(ErrorNotificationSchemaName) private readonly errorNotificationModel: Model<ErrorNotificationModel>,
  ) { }

  public async createNotificationError(
    eventDto: ErrorNotificationEventDto,
  ): Promise<void> {
    const settings: SettingsDto = await this.settingsService.getStoredSettingsByBusiness(
      eventDto.businessId,
      eventDto.type,
      eventDto.integration,
    );

    if (!settings || !settings.isEnabled) {
      return ;
    }

    if (SendingByCronUpdateIntervalErrorTypes.includes(eventDto.type)) {
      await this.errorNotificationModel.create(eventDto);
    }

    if (SendingByAfterIntervalErrorTypes.includes(eventDto.type)) {
      const res: ErrorNotificationModel = await this.errorNotificationModel.findOne(
        {
          businessId: eventDto.businessId,
          integration: eventDto.integration,
          type: eventDto.type,
        },
      );
      if (!res) {
        await this.errorNotificationModel.create(eventDto);
      } else {

        if (eventDto.errorDate.getTime() !== res.errorDate.getTime()) {
          eventDto.emailSent = false;
          eventDto.lastTimeSent = null;
          await this.updateErrorNotification(eventDto);
        }
      }
    }
  }

  public async getErrorNotificationDeliveryReadyCronInterval(
    dateFrom: Date,
    dateTo: Date,
  ): Promise<ErrorNotificationAggregateDto[]> {
    return this.errorNotificationModel.aggregate([
      {
        $match : {
            $and: [
              {
                'type': { $in: SendingByCronUpdateIntervalErrorTypes},
              },
              {
                'createdAt': {
                  $gte: dateFrom,
                  $lte: dateTo,
                },
              },
          ],
        },
      },
      {
        $group : {
          _id : {
            'businessId': '$businessId',
            'integration': '$integration',
            'type': '$type',
          },
          errors: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
          businessId: '$_id.businessId',
          integration: '$_id.integration',
          type: '$_id.type',

          errors: 1,
        },
      },
    ]);
  }

  public async getErrorNotificationDeliveryReadyAfterInterval(
  ): Promise<ErrorNotificationAggregateDto[]> {
    return this.errorNotificationModel.aggregate([
      {
        $match : {
          'type': { $in: SendingByAfterIntervalErrorTypes},
        },
      },
      {
        $group : {
          _id : {
            'businessId': '$businessId',
            'type': '$type',
          },
          errors: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $project: {
          _id: 0,
          businessId: '$_id.businessId',
          type: '$_id.type',

          errors: 1,
        },
      },
    ]);
  }


  public async getErrorNotificationToRemind(
    dateFrom: Date,
    dateTo: Date,
    business: string,
    type: ErrorNotificationTypesEnum,
    integration?: string,
  ): Promise<ErrorNotificationModel[]> {
    const filter: Array<{ }> = [
      { 'createdAt': {
          $gte: dateFrom,
          $lte: dateTo,
        },
      },
      { 'businessId': business},
      { 'type': type},
    ];

    if (integration) {
      filter.push({ 'integration': integration});
    }

    return this.errorNotificationModel.find(
      {
          $and: filter,
      },
    );
  }

  public async setErrorNotificationsEmailSent(
    errorNotifications: ErrorNotificationAggregateDto,
    sentDate: Date,
  ): Promise<void> {
    for (const error of errorNotifications.errors) {
      await this.errorNotificationModel.findOneAndUpdate(
        {
          businessId: error.businessId,
          integration: error.integration,
          type: error.type,
        },
        {
          $set: {
            emailSent: true,
            lastTimeSent: sentDate,
          },
        },
      );
    }
  }

  private async updateErrorNotification(eventDto: ErrorNotificationEventDto): Promise<void> {
    await this.errorNotificationModel.findOneAndUpdate(
      {
        businessId: eventDto.businessId,
        integration: eventDto.integration,
        type: eventDto.type,
      },
      {
        $set: eventDto,
      },
      {
        upsert: true,
      },
    );
  }

}
