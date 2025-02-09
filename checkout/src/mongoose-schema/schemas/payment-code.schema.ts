import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { PaymentCodeStatusEnum } from '../../legacy-api/enum';

export const PaymentCodeSchema: Schema = new Schema({
  _id: { type: String, default: uuid },
  apiCallId: { type: String, required: true },
  businessId: { type: String, required: true },
  code: { type: Number, required: true },
  flowId: { type: String, required: false },
  status: { type: PaymentCodeStatusEnum, default: PaymentCodeStatusEnum.new },
})
  .index({ businessId: 1, code: 1, status: 1 });
