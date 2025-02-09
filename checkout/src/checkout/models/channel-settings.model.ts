import { Document } from 'mongoose';
import { ChannelSettingsInterface } from '../interfaces';

export interface ChannelSettingsModel extends ChannelSettingsInterface, Document { }
