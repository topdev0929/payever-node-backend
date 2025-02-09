import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';
import * as uuid from 'uuid';
import { NotificationInterface } from '../../src/payment-notifications/interfaces';
import { PaymentNotificationStatusesEnum } from '../../src/payment-notifications/enums';

type NotificationType = NotificationInterface & { _id: string };

const LocalFactory: DefaultFactory<NotificationType> = (): NotificationType => {
  return {
    _id: uuid.v4(),
    apiCallId: 'b6ae699a-e5c7-40e5-a97e-8de5f20315e2',
    businessId: '13274c5d-fc8d-431e-eed4-112ce0b14cba',
    deliveryAt: new Date('2020-02-27 15:20:15.304'),
    message: '{"notification_type":"payment.created","created_at":"2020-02-27T15:20:19.767Z","data":{"payment":{"delivery_fee":0,"payment_fee":0,"id":"e4ae44e5-d218-41e8-a789-1c9c6c03a48a","uuid":"e4ae44e5-d218-41e8-a789-1c9c6c03a48a","amount":200.12,"address":{"city":"Berlin","country":"DE","country_name":"DE","email":"test@test.com","first_name":"First name","last_name":"Last name","phone":"+49837455","salutation":"MR","street":"staze 2","zip_code":"1234"},"api_call_id":"b6ae699a-e5c7-40e5-a97e-8de5f20315e2","business":{"company_name":"business-1","id":"b197bf22-6309-11e7-a2a8-5254008319f0","slug":"b197bf22-6309-11e7-a2a8-5254008319f0","uuid":"b197bf22-6309-11e7-a2a8-5254008319f0"},"channel":"api","created_at":"2020-02-27T15:20:19+00:00","currency":"EUR","customer_email":"test@test.com","customer_name":"Test","down_payment":0,"payment_type":"instant_payment","reference":"qwerty","status":"STATUS_NEW","total":200.12,"updated_at":"2020-02-27T15:20:19+00:00","items":[],"payment_details":{"recipientHolder":"Holder","recipientIban":"DE04888888880087654321"}}}}',
    notificationType: 'payment.created',
    paymentId: '9a474c5d-fc8d-431e-bbe8-389ce0b14cbf',
    retriesNumber: 0,
    status: PaymentNotificationStatusesEnum.STATUS_NEW,
    url: 'http://notice.url',
  };
};

export class NotificationFactory {
  public static create: PartialFactory<NotificationType> =
    partialFactory<NotificationType>(LocalFactory);
}
