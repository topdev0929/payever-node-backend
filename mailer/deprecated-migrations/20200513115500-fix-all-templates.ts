import { emailTemplates } from '../fixtures/email-templates';
import { authAutomatedEmailTemplates } from '../fixtures/automated';

export async function up(db: any): Promise<void> {
  for (const template of emailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: template._id },
      update: template,
    });
  }

  for (const automatedEmailTemplate of authAutomatedEmailTemplates) {
    await db._run('update', 'email_templates', {
      options: { upsert: true },
      query: { _id: automatedEmailTemplate._id },
      update: automatedEmailTemplate,
    });
  }

  return null;
}

export function down(): void {
  return null;
}
