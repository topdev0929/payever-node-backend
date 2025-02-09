import { TranslationsInterface } from './translations.interface';

export interface DisplayOptionsInterface {
  readonly title: string;
  readonly titleTranslations?: TranslationsInterface;
  readonly icon: string;
  readonly bgColor?: string;
}
