import { AccessInfo } from './access-info';

export interface Access {
  admin?: AccessInfo & Document;
  business?: AccessInfo & Document;
  partner?: AccessInfo & Document;
  user?: AccessInfo & Document;
}
