'use strict';

import { BaseMigration } from '@pe/migration-kit';
import { Collection, Db, MongoClient } from 'mongodb';

const ICON_WELCOME_MESSAGE: string = '#icon-commerceos-message';
const WELCOME_MESSAGE: string =
  `Welcome to payever Message app. We are here to help you. Let's get started by clicking the button below!`;

export class AddIconWelcomeMessage extends BaseMigration {
  public async up(): Promise<void> {
    const mongoClient: MongoClient = this.connection.getClient();
    const db: Db = mongoClient.db();

    const templates: any = await db.collection('chatmessagetemplates').findOneAndUpdate(
      {
        'interactive.translations.en': WELCOME_MESSAGE,
      },
      {
        $set: {
          'interactive.icon': ICON_WELCOME_MESSAGE,
        },
      },
    );

    if (!templates || !templates.value) {
      return;
    }


    await db.collection('chats').updateMany(
      {
        'lastMessages.interactive.translations.en': WELCOME_MESSAGE,
        'lastMessages.template': templates.value._id,
      },
      {
        $set: {
          'lastMessages.$.interactive.icon': ICON_WELCOME_MESSAGE,
          'lastMessages.$.updatedAt': new Date(),
        },
      },
    );

    await db.collection('chatmessages').updateMany(
      {
        'interactive.translations.en': WELCOME_MESSAGE,
        template: templates.value._id,
      },
      {
        $set: {
          'interactive.icon': ICON_WELCOME_MESSAGE,
          updatedAt: new Date(),
        },
      },
    );

  }

  public async down(): Promise<void> {
    return;
  }

  public description(): string {
    return 'Add Icon Welcome Message';
  }

  public migrationName(): string {
    return 'AddIconWelcomeMessage';
  }

  public version(): number {
    return 2;
  }
}
