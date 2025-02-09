import { ChannelAwareBusinessModel } from '@pe/channels-sdk';
import { Document, Types } from 'mongoose';
import { IntegrationSubscriptionModel } from '../../integration/models';
import { TerminalModel } from '../../terminal/models';
import { BusinessInterface } from '../interfaces';

export interface BusinessModel extends BusinessInterface, ChannelAwareBusinessModel, Document {
  readonly integrationSubscriptions: Types.DocumentArray<IntegrationSubscriptionModel>;
  readonly terminals: Types.DocumentArray<TerminalModel>;
}
