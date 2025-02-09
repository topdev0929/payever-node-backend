import { FieldsInterface } from './fields.interface';
import { FileDataInterface } from './file-data.interface';
import { UnwrappedFieldsInterface } from './unwrapped-fields.interface';
import { PaymentActionSourceEnum } from '../../enum';

export interface ActionPayloadInterface {
  paymentId?: string;
  fields?: FieldsInterface & UnwrappedFieldsInterface;
  files?: FileDataInterface[];
  source?: PaymentActionSourceEnum;
}
