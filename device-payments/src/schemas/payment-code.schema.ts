/* tslint:disable:object-literal-sort-keys */
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Schema } from 'mongoose';
import * as snakeCase from 'snakecase-keys';
import { v4 as uuid } from 'uuid';

import { CodeStatus, PaymentSource, Salutation, VerificationStep, VerificationType } from '../enum';
import { PaymentCode } from '../interfaces';

const PaymentFlowLogSchema: Schema = new Schema(
  {
    id: String,
    assignedAt: Date,
  },
  {  _id: false  });

const LogSchema: Schema = new Schema(
  {
    secondFactor: { type: Boolean, default: false, required: true },
    source: { type: PaymentSource, required: true },
    verificationStep: { type: VerificationStep, required: true, default: VerificationStep.initialization },
    verificationType: { type: VerificationType, required: true },
    paymentFlows: { type: [PaymentFlowLogSchema], default: [] },
  },
  {  _id: false  });

const AddressSchema: Schema = new Schema(
  {
    salutation: { type: String, enum: [Salutation.mr, Salutation.mrs] },
    firstName: String,
    lastName: String,
    email: String,
    country: String,
    city: String,
    zipCode: String,
    street: String,
    phone: String,
  },
  { _id: false });

const CartSchema: Schema = new Schema(
  {
    name: String,
    identifier: String,
    sku: String,
    price: Number,
    vat: Number,
    quantity: Number,
  },
  { _id: false });

const PaymentSchema: Schema = new Schema(
  {
    id: String,
    paymentType: String,
    uuid: String,
  },
  { _id: false });

const FlowSchema: Schema = new Schema(
  {
    id: String,
    amount: Number,
    reference: String,
    businessId: String,
    channelSetId: String,
    payment: { type: PaymentSchema, default: { }, required: true} ,
    billingAddress: { type: AddressSchema, default: { }, required: true} ,
    cart: [CartSchema],
  },
  {
    _id: false,
    toJSON: { transform: (doc: any, ret: string): string => {
      ret = snakeCase(ret);

      return ret;
    }},
  });

export const PaymentCodeSchemaName: string = 'PaymentCode';

export const PaymentCodeSchema: Schema<PaymentCode> = new Schema(
  {
    channelSetId: String,
    address: AddressSchema,

    _id: { type: String, default: uuid, required: true },
    code: Number,

    /** @deprecated */
    terminalId: String,

    applicationId: String,
    type: String,
    checkoutId: String,
    status: { type: CodeStatus, default: CodeStatus.accepted },
    flow: { type: FlowSchema, default: { }, required: true },
    log: { type: LogSchema, default: { }, required: true },
    sellerEmail: String,
  },
  { timestamps: true },
) as never;
PaymentCodeSchema.index({ code: 1, 'flow.businessId': 1 });

PaymentCodeSchema.statics.findOneBy = async function(conditions: object): Promise<PaymentCode> {
  const code: PaymentCode = await this.findOne(conditions);

  if (!code) {
    throw new NotFoundException('Payment code is not found by specified search criteria');
  }

  return code;
};

PaymentCodeSchema.methods.checkAmount = async function(amount: number): Promise<void | never> {
  if (amount > this.flow.amount) {
    throw new ForbiddenException('Given amount is higher than purchase amount');
  }
};
