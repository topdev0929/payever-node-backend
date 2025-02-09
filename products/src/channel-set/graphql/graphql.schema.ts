export interface ChannelSet {
  name?: string;
  type?: string;
  active?: boolean;
  business?: string;
  enabledByDefault?: boolean;
  customPolicy?: boolean;
  policyEnabled?: boolean;
  originalId?: string;
}

/* tslint:disable:interface-name */
export interface IQuery {
  getChannelSetByBusiness(businessId: string): ChannelSet[] | Promise<ChannelSet[]>;
}
