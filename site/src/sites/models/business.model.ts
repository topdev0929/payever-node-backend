import { Document } from 'mongoose';
import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { BusinessInterface } from '@pe/business-kit';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document {
}
