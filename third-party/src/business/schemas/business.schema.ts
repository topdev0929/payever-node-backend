import { IntegrationSubscriptionSchemaName } from '@pe/third-party-sdk';
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { BankAccountSchema, CompanyAddressSchema, ContactDetailsSchema } from '@pe/business-kit';

export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    bankAccount: { type: BankAccountSchema},
    companyAddress: { type: CompanyAddressSchema },
    contactDetails: { type: ContactDetailsSchema },
    contactEmails: [{ type: String }],
    currency: { type: String },
    name: { type: String },
    subscriptions: [{ type: Schema.Types.String, required: true, ref: IntegrationSubscriptionSchemaName }],
  },
  {
    timestamps: { },
  },
);
