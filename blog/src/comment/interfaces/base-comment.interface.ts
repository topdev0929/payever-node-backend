import { BusinessInterface } from '../../business/interfaces';

export interface BaseCommentInterface {
  business?: BusinessInterface;
  businessId: string;
}
