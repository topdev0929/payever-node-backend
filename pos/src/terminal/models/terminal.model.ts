import { Document, Types } from 'mongoose';

import { ChannelSetModel } from '@pe/channels-sdk';
import { BusinessModel } from '../../business/models';
import { IntegrationSubscriptionModel } from '../../integration/models';
import { TerminalInterface } from '../interfaces';

export interface TerminalModel extends TerminalInterface, Document {
  business?: BusinessModel;
  channelSets: ChannelSetModel[];
  channelSet: ChannelSetModel;
  integrationSubscriptions: Types.DocumentArray<IntegrationSubscriptionModel>;
}
