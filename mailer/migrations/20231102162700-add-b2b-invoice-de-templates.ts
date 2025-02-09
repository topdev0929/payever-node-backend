import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';
import { BaseMigration } from '@pe/migration-kit';

const emailTemplatesCollection: string = 'email_templates';

export class addB2BInvoiceVerifyTemplates extends BaseMigration {
  public async up(): Promise<void> {

    const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
      (item: EmailTemplatesType) => [
        'b2b_santander_invoice.confirm_purchase_otp',
        'b2b_santander_invoice.confirm_purchase_openbanking',

      ].includes(item.template_name),
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

  public async down(): Promise<void> {};

  public description(): string {
    return 'Adds B2B invoice verify templates'
  };

  public migrationName(): string {
    return 'addB2BInvoiceVerifyTemplates'
  }

  public version(): number {
    return 5
  }
}
