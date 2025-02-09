import { qrEmailTemplate } from '../fixtures/account-qr-email-template';

export async function up(db: any): Promise<void> {
  for (const automatedEmailTemplate of qrEmailTemplate) {
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
