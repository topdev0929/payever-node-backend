// tslint:disable: object-literal-sort-keys
import * as dotenv from 'dotenv';

import { templatesFixture } from '../../fixtures/templates.fixture';
import { ChatTemplateDocument, ChatMessageTemplate } from 'src/message/submodules/templates';

export async function updateTemplates(db: any, chatTemplateIds: string[]): Promise<void> {
  for (const templatePrototype of templatesFixture) {
    if (chatTemplateIds && !chatTemplateIds.includes(templatePrototype._id)) { continue; }
    await db._run(
      'update',
      'chattemplates',
      {
        query: { _id: templatePrototype._id },
        update: templatePrototype,
        options: { upsert: true },
      },
    );
    for (const message of templatePrototype.messages) {
      await db._run(
        'update',
        'chatmessagetemplates',
        {
          query: { _id: message._id },
          update: {
            ...message,
            interactive: {
              ...message.interactive,
              action: getServiceUrl(message.interactive.action),
            },
            chatTemplate: templatePrototype._id,
          },
          options: {
            upsert: true,
          },
        },
      );
    }

    const existingTemplates: ChatTemplateDocument[] = await db._run(
      'find',
      'chatmessagetemplates',
      {
        chatTemplate: templatePrototype._id,
      },
    );

    const templatesIdToDelete: string[] = existingTemplates
      .filter(
        (existing: ChatTemplateDocument) => !templatePrototype.messages.some(
          (message: ChatMessageTemplate) => message._id === existing._id,
        ),
      )
      .map((messageTemplateDocument: ChatTemplateDocument) => messageTemplateDocument._id);

    for (const _id of templatesIdToDelete) {
      await db._run(
        'remove',
        'chatmessagetemplates',
        { _id },
      );
    }
  }
}

function getServiceUrl(identifier: string): string {
  dotenv.config();
  const regex: RegExp = /\${(\w+)}/g;
  let url: string = identifier;
  let matches: string[] = regex.exec(url);

  while (matches) {
    url = url.replace(`\${${matches[1]}}`, process.env[matches[1]]);
    matches = regex.exec(url);
  }

  return url;
}
