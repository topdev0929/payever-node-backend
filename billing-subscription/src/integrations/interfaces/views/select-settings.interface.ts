import { SelectOptionInterface } from './select-option.interface';

export interface SelectSettingsInterface {
  disableOptionCentering?: boolean;
  multiple?: boolean;
  options?: SelectOptionInterface[];
  panelClass?: string;
  rawLabels?: boolean;
  placeholder?: string;
}
