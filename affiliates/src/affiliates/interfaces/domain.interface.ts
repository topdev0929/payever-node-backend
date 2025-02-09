import { AffiliateBrandingInterface } from './affiliate-branding.interface';

export interface DomainInterface {
  name: string;
  isConnected?: boolean;

  affiliateBranding: AffiliateBrandingInterface | string;
}
