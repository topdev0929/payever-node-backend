import { BusinessInterface } from '../../../business/interfaces';

export interface BusinessMediaInterface {
  business?: BusinessInterface;
  businessId: string;
  mediaType: string;
  name: string;
  url: string;
}
