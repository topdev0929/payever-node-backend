import { Model } from 'mongoose';
import { BaseFixture } from '@pe/cucumber-sdk';
import { RuleModel } from '@pe/rules-sdk';
import { FolderDocument, ScopeEnum } from '@pe/folders-plugin';
import { HeadlineFolders, HeadlinesRules } from '../../fixtures/headline-rules.fixture';

class HeadlinesFixture extends BaseFixture {
  protected readonly folderModel: Model<FolderDocument> = this.application.get('FolderModel');
  protected readonly rulesModel: Model<RuleModel> = this.application.get('BaseRuleModel');
  public async apply(): Promise<void> {
    await this.folderModel.create(
      HeadlineFolders,
    );
    await this.rulesModel.create(
      HeadlinesRules,
    );
  }
}

export = HeadlinesFixture;
