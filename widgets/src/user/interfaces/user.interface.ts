import { WidgetInstallationInterface, WidgetTutorialInterface } from '../../widget/interfaces';

export interface UserInterface {
  currency: string;
  installations: WidgetInstallationInterface[];
  tutorials: WidgetTutorialInterface[];
}
