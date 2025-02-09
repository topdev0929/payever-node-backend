import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CancelNotificationDto, CreateNotificationDto } from '../dto';
import { NotificationModel } from '../models/notification.model';
import { SubscriptionGroupModel } from '../models/subscription-group.model';

const COMMON_SUBSCRIPTION: string = 'common';

@Injectable()
export class NotificationService {

  constructor(
    @InjectModel('Notification') private readonly notificationModel: Model<NotificationModel>,
    @InjectModel('SubscriptionGroup') private readonly subscriptionGroupModel: Model<SubscriptionGroupModel>,
  ) { }

  public async create(createDto: CreateNotificationDto): Promise<NotificationModel> {
    const notification: NotificationModel = await this.notificationModel.create(createDto);

    return this.notificationModel.findById(notification.id);
  }

  public async findNotifications(kind: string, entity: string, app: string): Promise<NotificationModel[]> {
    const appList: string[] = await this.collectAppsForSubscription(app);

    return this.notificationModel.find(
      {
        app: {
          $in: appList,
        },
        entity: entity,
        kind: kind,
      },
      null,
      {
        limit: 10,
        sort: { createdAt: -1 },
      },
    );
  }

  public async countNotifications(kind: string, entity: string, app: string): Promise<number> {
    const appList: string[] = await this.collectAppsForSubscription(app);

    return this.notificationModel.countDocuments(
      {
        app: {
          $in: appList,
        },
        entity: entity,
        kind: kind,
      },
    );
  }

  public async findByHash(hash: string): Promise<NotificationModel[]> {
    return this.notificationModel.find({
      hash,
    });
  }

  public async deleteOneById(notificationId: string): Promise<void> {
    await this.notificationModel.deleteOne({ _id: notificationId }).exec();
  }

  public async collectAppsForSubscription(app: string): Promise<string[]> {
    const appGroups: SubscriptionGroupModel[] = await this.subscriptionGroupModel.find({
      $or: [
        {
          subscriptions: {
            $elemMatch: {
              $in: [ app, COMMON_SUBSCRIPTION ],
            },
          },
        },
        {
          common: true,
        },
      ],
    }).exec();

    const appList: string[] = appGroups.map((item: SubscriptionGroupModel) => item.name);
    appList.push(app);

    return appList;
  }

  public async collectAppsForNotification(app: string): Promise<string[]> {
    const appGroup: SubscriptionGroupModel = await this.subscriptionGroupModel.findOne({
      name: app,
    }).exec();

    const appList: string[] = appGroup ? appGroup.subscriptions : [ ];
    appList.push(app);

    return appList;
  }

  public async isCommonNotification(app: string): Promise<boolean> {
    const appGroup: SubscriptionGroupModel = await this.subscriptionGroupModel.findOne({
      name: app,
    });

    return appGroup ? appGroup.common : false;
  }

  public async deleteAllForBusiness(businessId: string): Promise<void> {
    await this.notificationModel.deleteMany({
      entity: businessId,
      kind: 'business',
    }).exec();
  }

  public async deleteTill(tillDate: Date): Promise<void> {
    await this.notificationModel.deleteMany(
      {
        createdAt: { $lte: tillDate },
      },
    ).exec();
  }

  public async deleteByDto(dto: CancelNotificationDto): Promise<string[]> {
    const deleteQuery: any = {
      entity: dto.entity,
      kind: dto.kind,
      message: dto.message,
    };
    if (dto.app) {
      deleteQuery.app = dto.app;
    }

    if (dto.data) {
      for (const key of Object.keys(dto.data)) {
        deleteQuery[`data.${key}`] = dto.data[key];
      }
    }

    const notifications: NotificationModel[] = await this.notificationModel.find(deleteQuery).exec();
    const ids: string[] = notifications.map((notification: NotificationModel) => notification._id);

    await this.notificationModel.deleteMany({ _id: ids }).exec();

    return ids;
  }
}
