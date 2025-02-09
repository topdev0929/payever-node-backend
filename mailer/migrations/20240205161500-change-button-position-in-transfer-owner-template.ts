import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';
import { BaseMigration } from '@pe/migration-kit';

const emailTemplatesCollection: string = 'email_templates';

export class changeButtonPositionInTransferOwnerTemplate extends BaseMigration {
  public async up(): Promise<void> {

    const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
      item => item.template_name === 'owner_transfer'
    );

    for (const template of templatesToUpdate) {
      await this.connection.collection(emailTemplatesCollection).findOneAndUpdate(
        {
          _id: template._id,
        },
        {
          $set: template,
        },
        {
          upsert: true,
        },
      );
    }

  }

  public async down(): Promise<void> { };

  public description(): string {
    return 'change button position in transfer owner template'
  };

  public migrationName(): string {
    return 'ChangeButtonPositionInTransferOwnerTemplate'
  }

  public version(): number {
    return 3;
  }
}
