import { HttpService, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { DeliveryAttemptModel, NotificationModel } from '../models';
import { NotificationService } from './notification.service';
import { DeliveryAttemptService } from './delivery-attempt.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AxiosError, AxiosResponse } from 'axios';
import { DeliveryAttemptDto } from '../dto';
import { NotificationEventEnum, PaymentNotificationStatusesEnum } from '../enums';
import { EventDispatcher } from '@pe/nest-kit';
import { NotificationSignatureGenerator } from './notification-signature.generator';
import {
  SEND_NOTIFICATION_TIMEOUT,
  SEND_NOTIFICATION_MAX_REDIRECTS,
  SEND_NOTIFICATION_CONNECT_TIMEOUT,
} from '../constants';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class NotificationSender {
  constructor(
    private readonly httpService: HttpService,
    private readonly notificationService: NotificationService,
    private readonly notificationSignatureGenerator: NotificationSignatureGenerator,
    private readonly deliveryAttemptService: DeliveryAttemptService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: Logger,
  ) { }

  public async sendPaymentNotification(notificationModel: NotificationModel): Promise<void> {
    let deliveryAttemptModel: DeliveryAttemptModel = await this.deliveryAttemptService.createDeliveryAttempt(
      notificationModel.id,
    );

    this.logger.log({
      message: `Sending notification #${notificationModel.id} for payment ${notificationModel.paymentId}`,
      noticeMessage: notificationModel.message,
      noticeUrl: notificationModel.url,
    });

    const headers: { } = {
      'Content-Type': 'application/json',
    };
    const signature: string =
      await this.notificationSignatureGenerator.generateNotificationSignature(notificationModel);

    if (signature) {
      headers['X-PAYEVER-SIGNATURE'] = signature;
    }

    const request: Observable<any> = this.httpService.post(
      notificationModel.url,
      notificationModel.message,
      {
        headers,
        httpAgent: new http.Agent({
          timeout: SEND_NOTIFICATION_CONNECT_TIMEOUT,
        }),
        httpsAgent: new https.Agent({
          timeout: SEND_NOTIFICATION_CONNECT_TIMEOUT,
        }),
        maxRedirects: SEND_NOTIFICATION_MAX_REDIRECTS,
        timeout: SEND_NOTIFICATION_TIMEOUT,
      },
    );

    const responseDto: {
      exceptionMessage?: string;
      status: number;
      responseMessage?: string;
    } = await request.pipe(
      map((response: AxiosResponse<any>) => {
        return {
          status: response.status,
        };
      }),
      catchError((e: AxiosError) => {
        this.logger.warn({
          error: e.message,
          message: `Failed sending notification #${notificationModel.id} for payment ${notificationModel.paymentId}`,
        });

        return of({
          exceptionMessage: e.response?.statusText ? e.response.statusText : e.message,
          responseMessage: JSON.stringify(e.response?.data ? e.response.data : e.message),
          status: e.response?.status ? e.response.status : HttpStatus.PRECONDITION_FAILED,
        });
      }),
    ).toPromise();

    this.logger.log({
      message: `Received response for notification #${notificationModel.id} for payment ${notificationModel.paymentId}`,
      response: responseDto,
    });

    const deliveryAttemptDto: DeliveryAttemptDto = {
      exceptionMessage: responseDto.exceptionMessage
        ? responseDto.exceptionMessage
        : null,
      notificationId: notificationModel.id,
      responseMessage: responseDto.responseMessage
        ? responseDto.responseMessage
        : null,
      responseStatusCode: responseDto.status,
      status: (responseDto.status >= 200 && responseDto.status < 300)
        ? PaymentNotificationStatusesEnum.STATUS_SUCCESS
        : PaymentNotificationStatusesEnum.STATUS_FAILED,
    };

    deliveryAttemptModel = await this.deliveryAttemptService.updateDeliveryAttempt(
      deliveryAttemptModel.id,
      deliveryAttemptDto,
    );

    notificationModel = await this.notificationService.addDeliveryAttempt(
      notificationModel,
      deliveryAttemptModel,
    );

    await this.eventDispatcher.dispatch(
      NotificationEventEnum.notificationSent,
      notificationModel,
      deliveryAttemptModel,
    );
  }
}
