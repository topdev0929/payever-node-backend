import { UserTokenInterface } from '@pe/nest-kit';
import { BusinessLocalDocument, UserDocument } from '../../projections/models';

export interface GetMessagingFilterContextInterface {
  user: UserDocument;
  userToken: UserTokenInterface;
  business?: BusinessLocalDocument;
  businessIds?: string[];
}
