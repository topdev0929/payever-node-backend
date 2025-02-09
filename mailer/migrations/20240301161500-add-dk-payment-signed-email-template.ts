import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';
import { BaseMigration } from '@pe/migration-kit';

const emailTemplatesCollection: string = 'email_templates';

export class AddDkPaymentSignedEmailTemplate extends BaseMigration {
  public async up(): Promise<void> {

    const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
      item => item.template_name === 'santander_dk_payment_application_signed_merchant'
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
    return 'add Dk payment signed email template'
  };

  public migrationName(): string {
    return 'AddDkPaymentSignedEmailTemplate'
  }

  public version(): number {
    return 1;
  }
}
