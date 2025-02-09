import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
    (item: EmailTemplatesType) => item.template_name === 'santander_payment_status_temporary_approved_merchant',
  );

  for (const template of templatesToUpdate) {
    await db._run('update', 'email_templates', {
      options: { upsert: true},
      query: { _id: template._id},
      update: template,
    });
  }
}

export function down(): void {
  return null;
}
