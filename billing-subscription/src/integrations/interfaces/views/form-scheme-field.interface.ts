import { FieldSettingsInterface } from './field-settings.interface';
import { SelectSettingsInterface } from './select-settings.interface';

export interface FormSchemeField {
  name?: string;
  type: string;
  value?: any;
  size?: string;
  requestOn?: {
    url?: string;
    method?: string;
  };
  requestOff?: {
    url?: string;
    method?: string;
  };
  fieldSettings?: FieldSettingsInterface;
  inputSettings?: {
    placeholder: string;
  };
  asyncSave?: boolean;
  slideToggleSettings?: {
    fullWidth: boolean;
    labelPosition: string;
  };
  selectSettings?: SelectSettingsInterface;
}
