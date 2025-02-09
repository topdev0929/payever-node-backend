import { Schema, SchemaTypeOpts } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { SignupModel } from './signup.model';

export const SignupsSchemaName: string = 'signups';

const requiredString: SchemaTypeOpts<any> = { type: String, required: true };
const optionalString: SchemaTypeOpts<any> = { type: String, optional: true, default: null };

export const SignupsSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    app: requiredString,
    baseCrmContactId: { type: Number, required: false, default: null },
    business_name: optionalString,
    contacted: { type: Boolean, default: false },
    country_code: optionalString,
    email: { type: String, required: true, unique: true },
    followupsSent: [{ type: Number, required: false }],
    form_name: optionalString,
    full_name: requiredString,
    phone: requiredString,
    pricing: optionalString,
    source_host: requiredString,
    utm_source: optionalString,
    website_url: optionalString,
  },
  {
    collection: SignupsSchemaName,
    timestamps: true,
  },
)
  .index({ email: 1, baseCrmContactId: 1 });

SignupsSchema.index({ contacted: 1});

