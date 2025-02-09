import { emailTemplates } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  await db._run('remove', 'email_templates', { template_name: 'default_layout_error_notification_email' });
  await db._run('remove', 'email_templates', { template_name: 'default_layout' });
  await db._run('remove', 'email_templates', { _id: '880416d1-ee35-410c-8dba-5043baab742f' });
  await db._run('remove', 'email_templates', { _id: 'a0541f7c-e335-4dd0-b4bc-d32365d88be4' });
  await db._run('remove', 'email_templates', { _id: 'fb948fca-e8fa-40a4-8634-88844ed6710e' });
  await db._run('remove', 'email_templates', { _id: '77de111a-35a0-41fb-a617-f69d66feed19' });

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
