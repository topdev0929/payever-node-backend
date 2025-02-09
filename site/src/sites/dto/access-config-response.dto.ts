import { SiteAccessConfig } from '../schemas';

export interface AccessConfigResponseDto extends SiteAccessConfig {
  id: string;
  privatePassword: undefined;
}
