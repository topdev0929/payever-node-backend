import { BusinessInterface } from './business.interface';
import { Document } from 'mongoose';
import { ChannelAwareBusinessModel } from '@pe/channels-sdk';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document { }
