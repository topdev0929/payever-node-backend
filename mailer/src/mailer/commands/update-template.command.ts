import { Model } from 'mongoose';

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Command, Option } from '@pe/nest-kit';

import { Template } from '../interfaces';
import { TemplateSchemaName } from '../schemas';

import { emailTemplates } from '../../../fixtures/email-templates';

@Injectable()
export class UpdateTemplateCommand {
  @InjectModel(TemplateSchemaName) private readonly templateModel: Model<Template>;

  @Command({
    command: 'templates:update [--name]',
    describe: 'Update email templates',
  })
  public async updateTemplate(
    @Option({
      name: 'name',
    }) name: string,
  ): Promise<void> {
    for (const template of emailTemplates) {
      if (name && template.template_name !== name) {
        continue;
      }
      await this.templateModel.findByIdAndUpdate(
        template._id,
        {
          $set: template,
        },
        {
          upsert: true,
        },
      );
      Logger.verbose(`Template "${template.template_name}" updated`);
    }
  }
}
