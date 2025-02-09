import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { emailTemplates } from '../../fixtures/email-templates';
import { Template, MailServerConfigInterface } from '../../src/mailer/interfaces';
import { TemplateSchemaName, MailServerConfigSchema, MailServerConfigSchemaName } from '../../src/mailer/schemas';
import { costumerAutomatedEmailTemplates, studioAutomatedEmailTemplate } from '../../fixtures/automated';
import { MailServerConfigsFixture } from '../../fixtures/mail-server-configs.fixture';
import { MailServerConfigModel } from '../../src/mailer/models';

class MailServerConfigFixture extends BaseFixture {
  private readonly model: Model<MailServerConfigModel> = this.application.get(getModelToken(MailServerConfigSchemaName));

  public async apply(): Promise<void> {
    const configs: MailServerConfigInterface[] = (MailServerConfigsFixture.filter((config) => config.env === 'TEST'));
    await this.model.create(configs);
  }
}

export = MailServerConfigFixture;
