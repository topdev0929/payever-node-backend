import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { emailTemplates } from '../../fixtures/email-templates';
import { Template } from '../../src/mailer/interfaces';
import { TemplateSchemaName } from '../../src/mailer/schemas';
import { costumerAutomatedEmailTemplates, studioAutomatedEmailTemplate } from '../../fixtures/automated';

class MailTemplatesFixture extends BaseFixture {
  private readonly model: Model<Template> = this.application.get(getModelToken(TemplateSchemaName));

  public async apply(): Promise<void> {
    await this.model.create(emailTemplates as any);
    await this.model.create(studioAutomatedEmailTemplate);
    await this.model.create(costumerAutomatedEmailTemplates);
  }
}

export = MailTemplatesFixture;
