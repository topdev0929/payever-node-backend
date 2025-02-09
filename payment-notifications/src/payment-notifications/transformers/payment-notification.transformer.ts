import { NotificationFailedDto } from '../dto';
import { DeliveryAttemptModel, NotificationModel } from '../models';
import { PaymentNotificationStatusesEnum } from '../enums';

export class PaymentNotificationTransformer {
  public static paymentNotificationToFailedMessage(
    notificationModel: NotificationModel,
    statusCode: number,
  ): NotificationFailedDto {
    return {
      businessId: notificationModel.businessId,
      deliveryAttempts:
        PaymentNotificationTransformer.getFailedAttemptsCount(notificationModel.deliveryAttempts).length,
      firstFailure: PaymentNotificationTransformer.getFirstFailure(notificationModel.deliveryAttempts),
      noticeUrl: notificationModel.url,
      paymentId: notificationModel.paymentId,
      statusCode: statusCode,
    };
  }

  private static getFailedAttemptsCount(deliveryAttempts: DeliveryAttemptModel[]): DeliveryAttemptModel[] {
    return deliveryAttempts.filter( (item: DeliveryAttemptModel) => {
      return item.status === PaymentNotificationStatusesEnum.STATUS_FAILED;
    });
  }

  private static getFirstFailure(deliveryAttempts: DeliveryAttemptModel[]): Date {
    const failedAttempts: DeliveryAttemptModel[] =
      PaymentNotificationTransformer.getFailedAttemptsCount(deliveryAttempts);

    let firstAttemptDate: Date = null;
    failedAttempts.forEach( (item: DeliveryAttemptModel) => {
      firstAttemptDate =
        firstAttemptDate ? item.createdAt < firstAttemptDate ? item.createdAt : firstAttemptDate : item.createdAt;
    });

    return firstAttemptDate;
  }

}
