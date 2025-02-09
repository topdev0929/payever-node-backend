import { productAutomatedEmailTemplates } from '../fixtures/automated';

export async function up(db: any): Promise<void> {
  for (const template of productAutomatedEmailTemplates) {
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
