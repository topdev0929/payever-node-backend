import { studioAutomatedEmailTemplate } from '../fixtures/automated';

export async function up(db: any): Promise<void> {
  for (const automatedEmailTemplate of studioAutomatedEmailTemplate) {
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
