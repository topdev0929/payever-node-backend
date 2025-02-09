// tslint:disable: object-literal-sort-keys
import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';

import { AppStatusEnum, ScopesEnum } from '../enums';
import { LinkSchema } from './link.schema';
import { AppActionSchema } from './app-action.schema';
import { AppHistorySchema } from './app-history.schema';

export const AppSchemaName: string = 'App';
export const AppSchema: Schema = new Schema(
  {
    _id: {
      default: uuid,
      type: String,
    },
    userId: {
      type: String,
    },
    key: { // (name)
      required: true,
      type: Schema.Types.String,
      unique: true,
    },
    category: {
      required: true,
      type: Schema.Types.String,
    },

    title: {
      type: Schema.Types.String,
    },
    description: {
      type: Schema.Types.String,
    },
    icon: {
      type: Schema.Types.String,
    },
    image: {
      type: Schema.Types.String,
    },

    countryList: {
      type: [String],
    },

    price: {
      type: Schema.Types.String,
    },
    developer: {
      type: Schema.Types.String,
    },
    languages: {
      type: [String],
    },

    links: {
      type: [LinkSchema],
    },

    status: {
      default: AppStatusEnum.Draft,
      enum: Object.values(AppStatusEnum),
      type: String,
    },
    rejectionReason: {
      type: String,
    },
    history: {
      default: [],
      type: [AppHistorySchema],
    },
    enabled: {
      default: true,
      type: Boolean,
    },

    actions: {
      default: [],
      type: [AppActionSchema],
    },
    events: {
      default: [],
      type: [String],
    },
    scopes: {
      default: [],
      enum: Object.values(ScopesEnum),
      type: [String],
    },

    connect: {
      action: String,
      form: String,
      url: String,
    },
    appUrl: { // Initiate the install process by sending a GET request
      type: String,
    },
    redirectionUrls: { // Allowed redirection urls for app to use
      default: [],
      type: [String],
    },
    clientId: {
      default: uuid,
      type: String,
    },
    clientSecret: {
      default: uuid,
      type: String,
    },

    apiKey: {
      type: String,
    },

    owner: {
      required: true,
      type: String,
    },
  },
  {
    timestamps: { },
  },
);

AppSchema.index({ key: 1 });
AppSchema.index({ title: 1 });
