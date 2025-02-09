/* eslint-disable-no-identical-functions no-duplicate-string object-literal-sort-keys */
import { LanguageInterface } from '@pe/common-sdk';
import { DefaultFactory, PartialFactory, partialFactory } from '@pe/cucumber-sdk';

type LanguageType = LanguageInterface & { _id: string };

const LocalFactory: DefaultFactory<LanguageType> = (): LanguageType => {
  return {
    _id: 'de',
    englishName: 'German',
    name: 'Deutsch',
  };
};

export class LanguageFactory {
  public static create: PartialFactory<LanguageType> = partialFactory<LanguageType>(LocalFactory);

  public static createDefaultLanguages(): LanguageType[] {
    const languages: LanguageType[] = [];

    languages.push(this.createGermanLanguage());
    languages.push(this.createEnglishLanguage());
    languages.push(this.createSwedishLanguage());
    languages.push(this.createDanishLanguage());
    languages.push(this.createNorwegianLanguage());
    languages.push(this.createSpanishLanguage());
    languages.push(this.createRussianLanguage());

    return languages;
  }

  public static createGermanLanguage(): LanguageType {
    return this.create({
      _id: 'de',
      englishName: 'German',
      name: 'Deutsch',
    });
  }

  public static createEnglishLanguage(): LanguageType {
    return this.create({
      _id: 'en',
      englishName: 'English',
      name: 'English',
    });
  }

  public static createSwedishLanguage(): LanguageType {
    return this.create({
      _id: 'sv',
      englishName: 'Swedish',
      name: 'Svenska',
    });
  }

  public static createDanishLanguage(): LanguageType {
    return this.create({
      _id: 'da',
      englishName: 'Danish',
      name: 'Dansk',
    });
  }

  public static createNorwegianLanguage(): LanguageType {
    return this.create({
      _id: 'no',
      englishName: 'Norwegian',
      name: 'Norsk',
    });
  }

  public static createSpanishLanguage(): LanguageType {
    return this.create({
      _id: 'es',
      englishName: 'Spanish',
      name: 'Español',
    });
  }

  public static createRussianLanguage(): LanguageType {
    return this.create({
      _id: 'ru',
      englishName: 'Russian',
      name: 'Русский',
    });
  }
}
