import { Model } from 'mongoose';

import { PaymentCode } from './payment-code.interface';

export interface PaymentCodeModel extends Model<PaymentCode> {
  findOneBy: (conditions: any) => Promise<PaymentCode>;
}
