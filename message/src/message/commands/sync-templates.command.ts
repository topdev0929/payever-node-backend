import { Injectable } from '@nestjs/common';
import { Command, Option } from '@pe/nest-kit';
import { FilterQuery } from 'mongoose';

import {
  ChatTemplateService,
  ChatMessageTemplateService,
  ChatTemplateDocument,
  ChatMessageTemplateDocument,
  TemplatesSynchronizationService,
} from '../submodules/templates';
import { EventOriginEnum } from '../enums';
import { BusinessModel, BusinessService } from '@pe/business-kit';
import { AbstractMessagingDocument } from '../submodules/platform';

@Injectable()
export class SyncTemplatesCommand {
  constructor(
    private readonly chatTemplateService: ChatTemplateService,
    private readonly chatMessageTemplateService: ChatMessageTemplateService,
    private readonly templatesSynchronizationService: TemplatesSynchronizationService,
    private readonly businessService: BusinessService,
  ) { }

  @Command({
    command: 'templates:sync',
    describe: 'Sync chat templates',
  })
  public async sync(
    @Option({
      name: 'business-filter',
    }) businesssFilterString: string,
    @Option({
      name: 'chat-template-apps',
    }) chatTemplateAppsString: string,
  ): Promise<void> {
    const businessFilter: FilterQuery<BusinessModel> = JSON.parse(businesssFilterString || '{}');
    const chatTemplateApps: string[] = JSON.parse(chatTemplateAppsString || '[]');

    let chatTemplateFilter: any = { };

    if (chatTemplateApps.length) {
      chatTemplateFilter = { app: { '$in': chatTemplateApps } };
    }

    const chatTemplates: ChatTemplateDocument[] = await this.chatTemplateService.find(chatTemplateFilter).exec();

    let page: number = 0;
    const limit: number = 100;

    while (true) {
      const skip: number = page * limit;

      const businesses: BusinessModel[] = 
        await this.businessService.findAll(businessFilter).sort([['createdAt', 1]]).limit(limit).skip(skip).exec();

      if (!businesses.length) {
        break;
      }
  
      for (const business of businesses) {
        for (const chatTemplate of chatTemplates) {
          const channel: AbstractMessagingDocument =
            await this.templatesSynchronizationService.syncChatTemplateForBusiness(
              chatTemplate,
              business,
              EventOriginEnum.Cli,
            );
          if (!channel) {
            continue;
          }
          const messageTemplates: ChatMessageTemplateDocument[] = await this.chatMessageTemplateService.find({
            chatTemplate: chatTemplate._id,
          }).sort({ order: 1 }).exec();
  
          const tasks: any[] = messageTemplates.map((messageTemplate: any) => {
            return this.templatesSynchronizationService.syncChatMessageTemplate(
              messageTemplate,
              channel,
              EventOriginEnum.Cli,
            );
          });
  
          await Promise.all(tasks);
        }
      }

      page++;
    }
  }
}
