import { Schema } from 'mongoose';
import * as beautifyUnique from 'mongoose-beautiful-unique-validation';
import { v4 as uuid } from 'uuid';

import { BusinessDetailSchemaName } from './business-detail.schema';
import { CompanyDocumentsSchema } from './company-documents.schema';
import { TaxesSchema } from './taxes.schema';
import { WallpaperSchema } from './wallpaper.schema';
import { ThemeSettingsSchema } from './theme-settings.schema';
import { UserSchemaName } from './user.schema';

export const BusinessSchemaName: string = 'Business';
export const BusinessSchema: Schema = new Schema(
  {
    _id: { type: String, default: uuid },
    active: {
      default: false,
      type: Boolean,
    },
    businessDetail: {
      ref: BusinessDetailSchemaName,
      type: String,
    },
    contactEmails: [String],
    cspAllowedHosts: [String],
    currency: String,
    currencyFormat: String,
    currentWallpaper: WallpaperSchema,
    defaultLanguage: String,
    documents: CompanyDocumentsSchema,
    hidden: {
      default: false,
      required: true,
      type: Boolean,
    },
    logo: String,
    name: {
      required: true,
      type: String,
      validate: {
        message: '{value} field can`t be left empty.',
        validator: (value: string) => value !== '',
      },
    },
    owner: {
      ref: UserSchemaName,
      type: String,
    },
    registrationOrigin: String,
    taxes: TaxesSchema,
    themeSettings: ThemeSettingsSchema,
  },
  {
    timestamps: { },
  },
)
  .index({ name: 1, owner: 1 }, { unique: true })
  .index({ createdAt: 1 })
  .index({ updatedAt: 1 })
  .index({ name: 1 })
  .index({ name: 'text', contactEmails: 'text' })
  .plugin(beautifyUnique, { defaultMessage: 'forms.error.validator.{PATH}.not_unique' });
