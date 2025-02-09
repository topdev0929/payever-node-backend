import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { Document } from 'mongoose';

export interface BusinessModel extends ChannelAwareBusinessModel, Document { }
