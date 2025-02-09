import { getModelToken } from '@nestjs/mongoose';
import { BaseFixture } from '@pe/cucumber-sdk/module';
import { Model } from 'mongoose';

import { emailTemplates } from '../../fixtures/email-templates';
import { Template } from '../../src/mailer/interfaces';
import { TemplateSchemaName } from '../../src/mailer/schemas';
import { costumerAutomatedEmailTemplates, studioAutomatedEmailTemplate } from '../../fixtures/automated';

const TEMPLATE_ID_1: string = 'template-id-1';
const TEMPLATE_ID_2: string = 'template-id-2';
const TEMPLATE_ID_3: string = 'template-id-3';

class AdminTemplatesFixture extends BaseFixture {
  private readonly model: Model<Template> = this.application.get(getModelToken(TemplateSchemaName));

  public async apply(): Promise<void> {
    await this.model.create([
      {
        _id: TEMPLATE_ID_1,
        attachments: [],
        body: 'body-1',
        description: 'Default layout en',
        layout: null,
        locale: 'en',
        section: 'Email Template',
        subject: 'default layout en',
        template_name: 'default_layout_en',
        template_type: 'system',
        use_layout: false,
      },
      {
        _id: TEMPLATE_ID_2,
        attachments: [],
        body: 'body-2',
        description: 'Default layout de',
        layout: null,
        locale: 'en',
        section: 'Email Template',
        subject: 'default layout de',
        template_name: 'default_layout_de',
        template_type: 'system',
        use_layout: false,
      },
      {
        _id: TEMPLATE_ID_3,
        body: 'body-3',
        description: 'New user registered',
        layout: 'en',
        locale: 'en',
        section: 'Admin',
        subject: 'New user registered',
        template_name: 'admin_registration_notice',
        template_type: 'system',
        use_layout: true,
      }
    ]);


  }
}

export = AdminTemplatesFixture;
