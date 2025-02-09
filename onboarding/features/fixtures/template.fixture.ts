import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';
import { TemplateModel } from '../../src/onboarding/models';

class TemplateFixture extends BaseFixture {
  private readonly templateModel: Model<TemplateModel> = this.application.get('TemplateModel');

  public readonly templateId1: string = '15edf7ca-cc8e-406c-9cd5-964b19eafb11';
  public readonly templateName1: string = 'cucumber-template-1';

  public readonly templateId2: string = '25edf7ca-cc8e-406c-0cd5-964b19eafb12';
  public readonly templateName2: string = 'cucumber-template-2';

  public async apply(): Promise<void> {
    await this.createTemplates();
  }

  private async createTemplates(): Promise<void> {
    await this.templateModel.create(
      {
        name: this.templateName1,
        config:
        [
          {
            verificationRequired: true
          }
        ],
        _id: this.templateId1,
      },
    );

    await this.templateModel.create(
      {
        name: this.templateName2,
        config:
        [
          {
            verificationRequired: false
          }
        ],
        _id: this.templateId2,
      },
    );
  }
}

export = TemplateFixture;
