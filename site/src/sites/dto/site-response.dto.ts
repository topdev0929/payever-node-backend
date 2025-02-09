import { LeanDocument } from 'mongoose';
import { BusinessInterface } from '@pe/business-kit';
import { ChannelAwareBusinessInterface, ChannelSetInterface } from '@pe/channels-sdk';

import { DomainInterface } from '../interfaces';
import { SiteDocument } from '../schemas';
import { AccessConfigResponseDto } from './access-config-response.dto';

type OmitProperties =  'accessConfig' | 'channelSet' | 'domain' | 'business';

export interface SiteResponseDto extends Omit<LeanDocument<SiteDocument>, OmitProperties> {
  business: BusinessInterface & ChannelAwareBusinessInterface & { id: string };
  accessConfig: AccessConfigResponseDto | string;
  accessConfigDocument: undefined;
  channelSet: ChannelSetInterface | string;
  channelSetDocument: undefined;
  domain: DomainInterface[]  | string[];
  domainDocument: undefined;
}

export interface BriefSiteInfoResponseDto {
  _id: string;
  name: string;
  picture?: string;

  accessConfig: {
    _id: string;
    approvedCustomersAllowed: boolean;
    isLive: boolean;
    isLocked: boolean;
    isPrivate: boolean;
  };
}

