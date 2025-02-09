import { Document, Types } from 'mongoose';
import { ConnectionModel } from '../../connection/models';
import { CheckoutInterface } from '../interfaces';
import { ChannelSettingsModel } from './channel-settings.model';
import { CheckoutSectionModel } from './checkout-section.model';
import { CheckoutSettingsModel } from './settings.model';

export interface CheckoutModel extends CheckoutInterface, Document {
  readonly channelSettings: ChannelSettingsModel;
  readonly sections: CheckoutSectionModel[];
  readonly settings: CheckoutSettingsModel;
  readonly connections: Types.DocumentArray<ConnectionModel>;
}
