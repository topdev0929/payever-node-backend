import { BusinessInterface } from '@pe/business-kit';
import { Document } from 'mongoose';
import { ChannelAwareBusinessModel } from '@pe/channels-sdk';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document { }
