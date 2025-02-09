import { CampaignModel } from './campaign-model';
import { Info } from '../classes';

export interface CampaignsModel {
  campaigns: CampaignModel[];
  info: Info;
}
