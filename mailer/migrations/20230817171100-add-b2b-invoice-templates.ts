import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';
import { BaseMigration } from '@pe/migration-kit';

const emailTemplatesCollection: string = 'email_templates';

export class addB2BInvoiceTemplates extends BaseMigration {
  public async up(): Promise<void> {

    const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
      (item: EmailTemplatesType) => [
        'b2b_santander_invoice.accepted',
        'b2b_santander_invoice.shipped',
        'b2b_santander_invoice.due_date.before',
        'b2b_santander_invoice.due_date.after',
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
    return 'Adds B2B invoice templates'
  };

  public migrationName(): string {
    return 'addB2BInvoiceTemplates'
  }

  public version(): number {
    return 1
  }
}
