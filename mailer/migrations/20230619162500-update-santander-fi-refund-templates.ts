import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';
import { BaseMigration } from '@pe/migration-kit';

const emailTemplatesCollection: string = 'email_templates';

export class updateSantanderFiRefundTemplate extends BaseMigration {
  public async up(): Promise<void> {
    
    const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
      (item: EmailTemplatesType) => [
        'santander_fi.payment_action.refund_santander',
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
      );
    }
    
  }
  
  public async down(): Promise<void> {};
  
  public description(): string {
    return 'updateSantanderFiRefundTemplate'
  };
  
  public migrationName(): string {
    return 'updateSantanderFiRefundTemplate'
  }
  
  public version(): number {
    return 2
  }
}
