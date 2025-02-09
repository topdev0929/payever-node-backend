import { TermsFieldsTypeEnum } from '../../enum';

export interface TermsFormInterface {
  field_name: string;
  field_text: string;
  type: TermsFieldsTypeEnum;
  required: boolean;
}
