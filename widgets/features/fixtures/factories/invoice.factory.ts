import { 
  partialFactory, 
  PartialFactory, 
  DefaultFactory,
} from '@pe/cucumber-sdk';
import { v4 } from 'uuid';

export const defaultInvoiceFactory: DefaultFactory<any> = (): any => ({
  _id: v4(),
  amountPaid: 20,
  currency: 'EUR',
});

export const invoiceFactory: PartialFactory<any> = partialFactory<any>(defaultInvoiceFactory);
