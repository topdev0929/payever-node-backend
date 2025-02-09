import { Document } from 'mongoose';
import { CampaignInterface } from '../interfaces';

export interface CampaignModel extends CampaignInterface, Document {
  id: string;
}
