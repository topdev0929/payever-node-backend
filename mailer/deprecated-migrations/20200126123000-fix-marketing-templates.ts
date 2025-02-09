import { marketingEmailTemplates } from '../fixtures/marketing-email-templates';

export async function up(db: any): Promise<void> {
  for (const template of marketingEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: { $set: { body: template.body } },
    });
  }

  return null;
}

export function down(): void {
  return null;
}
