import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const santanderNLRefundTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'santander_nl.payment_action.refund';
    });

  if (santanderNLRefundTemplate) {
    await db._run('insert', 'email_templates', santanderNLRefundTemplate);
  }

  return null;
}

export function down(): void {
  return null;
}
