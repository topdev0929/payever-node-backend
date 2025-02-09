import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateWriteOpResult } from 'mongoose';
import { ApiCallModel, DeliveryAttemptModel, NotificationModel } from '../models';
import { NotificationSchemaName } from '../schemas';
import { ApiCallService } from './api-call.service';
import { AtomDateConverter, TransactionEventPaymentDto } from '@pe/payments-sdk';
import { PaymentEventTypesEnum, PaymentNotificationStatusesEnum } from '../enums';
import {
  NotificationDto,
  NotificationFilterResultDto,
  NotificationMessageDto,
  NotificationMessagePaymentDto,
  PaymentNotificationTransactionDto,
  NotificationFilterRequestDto,
  NotificationResponseDto,
  PaymentEventDto,
} from '../dto';
import { plainToClass } from 'class-transformer';
import { AccessTokenPayload, Mutex, RolesEnum, UserRoleMerchant, UserRoleOauth } from '@pe/nest-kit';
import * as moment from 'moment';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(NotificationSchemaName)
    private readonly notificationModel: Model<NotificationModel>,

    private readonly apiCallService: ApiCallService,
    private readonly mutex: Mutex,
    private readonly logger: Logger,
  ) { }

  public async getNotification(id: string): Promise<NotificationModel> {
    const notification: NotificationModel = await this.notificationModel.findOne({ _id: id });

    if (notification) {
      await notification.populate('deliveryAttempts').execPopulate();
    }

    return notification;
  }

  public async getNotificationByPaymentId(
    paymentId: string,
    user: AccessTokenPayload,
  ): Promise<NotificationFilterResultDto> {
    const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);
    const oauthRole: UserRoleOauth = user.getRole(RolesEnum.oauth);
    const businessId = merchantRole.permissions?.[0]?.businessId || oauthRole.permissions?.[0]?.businessId;

    const notificationModels: NotificationModel[] = await this.notificationModel
      .find({ paymentId, businessId }).populate('deliveryAttempts');
    const total: number = await this.notificationModel
      .count({ paymentId, businessId });

    const notifications: NotificationResponseDto[] = plainToClass(NotificationResponseDto, notificationModels);

    return { total, page: 1, totalPages: 1, events: notifications };
  }

  public async getNotifications(
    user: AccessTokenPayload,
    filter: NotificationFilterRequestDto,
  ): Promise<NotificationFilterResultDto> {
    const merchantRole: UserRoleMerchant = user.getRole(RolesEnum.merchant);
    const oauthRole: UserRoleOauth = user.getRole(RolesEnum.oauth);
    const businessId = merchantRole.permissions?.[0]?.businessId || oauthRole.permissions?.[0]?.businessId;

    const query: any = { businessId };
    if (filter.from && filter.to) {
      query.createdAt = { $gte: filter.from, $lt: moment(filter.to).add(1, 'day').toDate() };
    }
    if (filter.eventType) {
      query.notificationType = filter.eventType;
    }
    if (filter.status) {
      query.status = filter.status;
    }

    const sort: { [key: string]: number } = { };
    if (filter.orderBy) {
      sort[filter.orderBy] = filter.direction ? 1 : -1;
    }

    const defaultMaxLimit: number = 100;
    const defaultLimit: number = 20;
    if (filter.limit > defaultMaxLimit) {
      filter.limit = defaultMaxLimit;
    }
    if (!filter.page) {
      filter.page = 1;
    }

    const total: number = await this.notificationModel.find(query).count();
    const limit: number = filter.limit ?? defaultLimit;
    const offset: number = limit * (filter.page - 1);
    const totalPages: number = Math.floor(total / limit) + 1;
    const notificationModels: NotificationModel[] = await this.notificationModel
      .find(query)
      .select(filter?.projection ?? { })
      .sort(sort)
      .limit(limit)
      .skip(offset)
      .populate('deliveryAttempts').lean();

    const notifications: NotificationResponseDto[] = plainToClass(NotificationResponseDto, notificationModels);

    return { total, page: filter.page, totalPages, events: notifications };
  }

  public async createPaymentNotificationFromPaymentEvent(
    data: PaymentEventDto,
    paymentEventType: PaymentEventTypesEnum,
  ): Promise<NotificationModel> {
    const paymentDto: PaymentNotificationTransactionDto = data.payment;

    this.logger.log(
      {
        dto: data,
        message: 'Payment notification handling: started dto handling',
        paymentId: paymentDto.id,
      },
    );

    const apiCallModel: ApiCallModel = await this.apiCallService.findByApiCallId(
      paymentDto.api_call_id,
    );

    if (!apiCallModel || (apiCallModel && !apiCallModel.noticeUrl)) {
      this.logger.log(
        {
          apiCall: apiCallModel,
          dto: paymentDto,
          message: 'Payment notification handling: api call not found or missing notice url',
          noticeUrl: apiCallModel?.noticeUrl,
          paymentId: paymentDto.id,
        },
      );

      return;
    }

    try {
      const notificationMessage: NotificationMessageDto = {
        created_at: AtomDateConverter.fromDateToAtomFormat(new Date()),
        data: {
          error: data.error ? data.error : undefined,
          event_source: data.event_source ? data.event_source : undefined,
          payment: {
            ...plainToClass<NotificationMessagePaymentDto, TransactionEventPaymentDto>(
              NotificationMessagePaymentDto,
              paymentDto,
            ),
            merchant_name: paymentDto?.business?.company_name,
          },
        },
        notification_type: paymentEventType,
      };

      if (data.action) {
        notificationMessage.data.action = {
          amount: data.amount,
          reference: data.reference,
          source: data.action_source,
          type: data.action,
          unique_identifier: data.unique_identifier,
        };
      }

      this.logger.log(
        {
          message: 'Payment notification handling: notification message created',
          notificationMessage,
          paymentId: paymentDto.id,
        },
      );

      const notificationDto: NotificationDto = {
        apiCallId: apiCallModel.id,
        businessId: paymentDto.business.uuid,
        message: JSON.stringify(notificationMessage),
        notificationType: paymentEventType,
        paymentId: paymentDto.id,
        status: PaymentNotificationStatusesEnum.STATUS_NEW,
        url: this.apiCallService.modifyCallbackUrl(apiCallModel.noticeUrl, apiCallModel.id, paymentDto.id),
      };

      this.logger.log(
        {
          message: 'Payment notification handling: notification dto created',
          notificationDto,
          paymentId: paymentDto.id,
        },
      );

      const notificationModel: NotificationModel = await this.mutex.lock(
        'payment-notifications',
        paymentDto.uuid,
        async () => this.notificationModel.create(notificationDto),
      );

      this.logger.log(
        {
          message: 'Payment notification handling: notification saved to db',
          paymentId: paymentDto.id,
        },
      );

      return notificationModel;
    } catch (e) {
      this.logger.log(
        {
          error: e.message,
          message: 'Payment notification handling: error occurred',
          paymentId: paymentDto.id,
        },
      );
    }
  }

  public async updateNotificationMessage(
    notification: NotificationModel,
    message: NotificationMessageDto,
  ): Promise<void> {
    await this.notificationModel.updateOne(
      { _id: notification.id },
      { $set: { message: JSON.stringify(message) }},
    );
  }

  public async getNotificationsDeliveryReady(
    startTime: Date,
    endTime: Date,
    status: PaymentNotificationStatusesEnum,
    maxRetriesNumber: number = 2,
  ): Promise<NotificationModel[]> {
    return this.notificationModel.find(
      {
        deliveryAt: { $gte: startTime, $lte: endTime },
        retriesNumber: { $lt: maxRetriesNumber },
        status,
      },
      { },
      { sort: { deliveryAt : 1 }},
    );
  }

  public async getFailedNotifications(
    startTime: Date,
    endTime: Date,
    maxRetriesNumber: number = 2,
  ): Promise<NotificationModel[]> {
    return this.notificationModel.find(
      {
        deliveryAt: { $gte: startTime, $lte: endTime },
        retriesNumber: { $gte: maxRetriesNumber },
        status: PaymentNotificationStatusesEnum.STATUS_FAILED,
      },
      { },
      { sort: { deliveryAt : 1 }},
    );
  }

  public async getProcessingNotifications(
    endTime: Date,
  ): Promise<NotificationModel[]> {
    return this.notificationModel.find(
      {
        deliveryAt: { $lte: endTime },
        status: PaymentNotificationStatusesEnum.STATUS_PROCESSING,
      },
    );
  }

  public async addDeliveryAttempt(
    notificationModel: NotificationModel,
    deliveryAttemptModel: DeliveryAttemptModel,
  ): Promise<NotificationModel> {
    notificationModel.depopulate('deliveryAttempts');
    if (notificationModel.deliveryAttempts.indexOf(deliveryAttemptModel.id) !== -1) {
      return;
    }

    return this.notificationModel.findOneAndUpdate(
      { _id: notificationModel.id },
      {
        $inc: { retriesNumber: 1 },
        $push: { deliveryAttempts: deliveryAttemptModel.id },
        $set: { status: deliveryAttemptModel.status },
      },
      { new: true },
    );
  }

  public async markNotificationAsProcessing(
    notificationModel: NotificationModel,
  ): Promise<NotificationModel> {
    return this.notificationModel.findOneAndUpdate(
      {
        _id: notificationModel.id,
      },
      {
        $set: { status: PaymentNotificationStatusesEnum.STATUS_PROCESSING },
      },
      { new: true },
    );
  }

  public async renewAllProcessingNotifications(): Promise<UpdateWriteOpResult> {
    return this.notificationModel.updateMany(
      {
        status: PaymentNotificationStatusesEnum.STATUS_PROCESSING,
      },
      {
        $set: { status: PaymentNotificationStatusesEnum.STATUS_NEW },
      },
    );
  }

  public async countNotificationsByPaymentId(paymentId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      paymentId,
    });
  }
}
