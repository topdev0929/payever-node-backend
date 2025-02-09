import { emailTemplates } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  for (const template of emailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: template,
    });
  }
  await db.addIndex('email_templates', null, ['template_name', 'locale'], true);

  return null;
}

export function down(): void {
  return null;
}
