import { LegalDocumentInterface } from '@pe/common-sdk';
import { BusinessInterface } from '../../user/interfaces';

export interface BusinessLegalDocumentInterface extends LegalDocumentInterface {
  business: BusinessInterface;
}
