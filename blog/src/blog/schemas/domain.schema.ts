import { Schema } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { DomainModel } from '../models';
import { BlogSchemaName } from '../../mongoose-schema/mongoose-schema.names';


export const DomainSchema: Schema<DomainModel> = new Schema<DomainModel>(
  {
    _id: {
      default: uuid,
      required: true,
      type: String,
    },
    blog: {
      index: true,
      ref: BlogSchemaName,
      required: true,
      type: String,
    },
    isConnected: {
      default: false,
      required: true,
      type: Boolean,
    },
    name: {
      index: true,
      required: true,
      type: String,
      unique: true,
    },
  }, 
  {
    timestamps: true,
  },
);

DomainSchema.index(
  {
    name: 1,
  }, 
  {
    unique: true,
  },
);
