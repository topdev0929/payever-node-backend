import { WidgetInstallationInterface, WidgetTutorialInterface } from '../../widget/interfaces';

export interface BusinessInterface {
  currency: string;
  installations: WidgetInstallationInterface[];
  tutorials: WidgetTutorialInterface[];

  /**
   * @description \@pe/business-kit compat-only field
   */
  readonly name: string;
}
