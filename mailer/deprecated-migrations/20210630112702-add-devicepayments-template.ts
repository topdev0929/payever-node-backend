import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const templateToUpdate: EmailTemplatesType = emailTemplates.find(
    (item: EmailTemplatesType) => item.template_name === 'device_payments.payment_fullfil_link',
  );

  await db._run('update', 'email_templates', {
    options: { upsert: true },
    query: { _id: templateToUpdate._id },
    update: templateToUpdate,
  });
}

export function down(): void {
  return null;
}
