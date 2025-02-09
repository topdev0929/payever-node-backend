import { TutorialUrlInterface } from './tutorial-url.interface';

export interface TutorialInterface {
  readonly title: string;
  readonly icon: string;
  readonly image?: string;
  /** @deprecated */
  readonly url?: string;
  readonly urls?: TutorialUrlInterface[];
  readonly showOnTutorial?: boolean;
}
