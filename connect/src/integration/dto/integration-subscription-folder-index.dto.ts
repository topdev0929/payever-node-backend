import { ScopeEnum } from '@pe/folders-plugin';
import { TranslationInterface } from '@pe/translations-sdk';

export class IntegrationSubscriptionFolderIndexDto  {
  public businessId: string;
  public integration: string;
  public category: string;
  public developer: string;
  public developerTranslations: TranslationInterface;
  public installed: boolean;
  public name: string;
  public title: string;
  public userId: string;
  public createdAt?: Date;
  public parentFolderId: string;
  public titleTranslations: TranslationInterface;
  public scope: ScopeEnum;
}
