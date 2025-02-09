import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const santanderATCancelTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'santander_at.payment_action.cancel';
    });

  if (santanderATCancelTemplate) {
    await db._run('insert', 'email_templates', santanderATCancelTemplate);
  }

  return null;
}

export function down(): void {
  return null;
}
