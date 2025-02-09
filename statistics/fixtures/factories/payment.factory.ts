import * as uuid from 'uuid';
import { partialFactory, SequenceGenerator } from '@pe/cucumber-sdk';
import { PaymentStatusesEnum } from '../../src/statistics';

const seq: SequenceGenerator = new SequenceGenerator();

const countries = ['DE', 'UA'];
const channels = ['pos', 'shop'];
const paymentMethods = ['santander_pos_installment', 'stripe', 'paypal', 'sofort'];
const statuses = [PaymentStatusesEnum.statusRefunded, PaymentStatusesEnum.statusPaid, PaymentStatusesEnum.statusAccepted];

export const defaultPaymentFactory: any = (): any => {
  seq.next();

  const amount = Math.floor(Math.random() * 900) + 100;
  const date = new Date(new Date('2017-01-01').getTime() + Math.random() * (new Date().getTime() - new Date('2017-01-01').getTime()));

  return ({
    _id: uuid.v4(),
    'amount' : amount,
    'billingAddress' : {
      'city' : 'city',
      'country' : countries[Math.floor(Math.random() * countries.length)],
      'countryName' : 'country',
      'street' : 'street',
      'zipCode' : '20457',
      '_id' : uuid.v4(),
    },
    'businessId' : '205954e0-4641-41fa-b6ca-6d0d83b37fad',
    'businessName' : 'Santander DE',
    'channel' : channels[Math.floor(Math.random() * channels.length)],
    'channelSetId' : '65ceae0a-b810-41b9-907f-923b6f7892a1',
    'createdAt' : date,
    'currency' : 'EUR',
    'deliveryFee' : 0,
    'downPayment' : 0,
    'items' : null,
    'originalId' : 'a1a39985f866f72679ffc9fb4841ad53',
    'paymentMethod' : paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    'reference' : '3b864596-ca5b-429b-bfc1-4f9d5d87c375',
    'shippingAddress' : {
      'city' : 'city',
      'country' : countries[Math.floor(Math.random() * countries.length)],
      'countryName' : 'country',
      'street' : 'street',
      'zipCode' : '20457',
      '_id' : uuid.v4(),
    },
    'specificStatus' : 'ACCEPTED',
    'status' : statuses[Math.floor(Math.random() * statuses.length)],
    'total' : amount,
    'updatedAt' : new Date(date.setSeconds(date.getSeconds() + Math.floor(Math.random() * 600))),
  });
};

export const PaymentFactory: any = partialFactory(defaultPaymentFactory);
