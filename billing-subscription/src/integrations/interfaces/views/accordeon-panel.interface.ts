import { InfoBoxActionInterface } from './info-box-action.interface';
import { FormSchemeField } from './form-scheme-field.interface';
import { FieldsetData } from './fieldset-data.interface';

export interface AccordionPanelInterface {
  title: string;
  operation: InfoBoxActionInterface;
  icon: string;
  fieldset?: FormSchemeField[];
  fieldsetData: FieldsetData;
}
