import { emailTemplates } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  await db._run('remove', 'email_templates', { template_name: 'second_layout' });

  for (const template of emailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: template,
    });
  }
}

export function down(): void {
  return null;
}
