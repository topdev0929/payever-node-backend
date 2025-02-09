import { SectionsEnum } from '../enums';

export interface DefaultStepInterface {
  action: string;
  allowSkip: boolean;
  order: number;
  section: SectionsEnum;
  title: string;
}
