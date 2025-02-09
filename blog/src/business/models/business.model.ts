import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { BlogModel } from '../../blog/models';
import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document {
  readonly blogs: Types.DocumentArray<BlogModel>;
}
