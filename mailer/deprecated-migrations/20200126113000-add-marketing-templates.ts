import { marketingEmailTemplates } from '../fixtures/marketing-email-templates';

export async function up(db: any): Promise<void> {
  for (const marketingTemplate of marketingEmailTemplates) {
    await db._run('insert', 'email_templates', marketingTemplate);
  }

  return null;
}

export function down(): void {
  return null;
}
