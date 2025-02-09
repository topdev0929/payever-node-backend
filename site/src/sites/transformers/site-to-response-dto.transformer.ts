import { BusinessInterface } from '@pe/business-kit';
import { ChannelAwareBusinessInterface } from '@pe/channels-sdk';

import { Site, SiteAccessConfigDocument, SiteDocument } from '../schemas';
import { SiteResponseDto, BriefSiteInfoResponseDto } from '../dto';
import { accessConfigToResponseDto } from './access-config-to-response-dto.transformer';

export function siteToResponseDto(site: SiteDocument): SiteResponseDto {
  if (!site) {
    return ;
  }

  const plainSite: Site = site.toJSON();
  const plainBusiness: BusinessInterface & ChannelAwareBusinessInterface = site.business?.toJSON();

  return {
    ...plainSite,
    id: plainSite._id,
    accessConfig: site.accessConfigDocument && site.accessConfigDocument.length > 0  
      ? accessConfigToResponseDto(site.accessConfigDocument[0]) 
      : site.accessConfig[0],
    accessConfigDocument: undefined,
    business: plainBusiness && {
      ...plainBusiness,
      id: site.business?._id,
    },
    channelSet: site.channelSetDocument?.toJSON() || site.channelSet,
    channelSetDocument: undefined,
    domain: site.domainDocument || site.domain,
    domainDocument: undefined,
  };
}

export function siteToBriefInfoResponseDto(site: SiteDocument): BriefSiteInfoResponseDto {
  const accessConfigDocument: SiteAccessConfigDocument = 
    site.accessConfigDocument?.length > 0 ? site.accessConfigDocument[0] : null;
  
  return {
    _id: site._id,
    name: site.name,
    picture: site.picture,

    accessConfig: {
      _id: accessConfigDocument?._id,
      approvedCustomersAllowed: accessConfigDocument?.approvedCustomersAllowed,
      isLive: accessConfigDocument?.isLive,
      isLocked: accessConfigDocument?.isLocked,
      isPrivate: accessConfigDocument?.isPrivate,
    },
  };
}
