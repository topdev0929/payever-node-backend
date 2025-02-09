import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
    (item: EmailTemplatesType) => [
      'pos_santander_de.customer.signing_link',
    ].includes(item.template_name),
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
