import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';

import { CampaignModel } from '../../campaign';
import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document {
  campaigns: Types.DocumentArray<CampaignModel>;
}
