import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const santanderATRefundTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'santander_at.payment_action.refund';
    });

  if (santanderATRefundTemplate) {
    await db._run('insert', 'email_templates', santanderATRefundTemplate);
  }

  return null;
}

export function down(): void {
  return null;
}
