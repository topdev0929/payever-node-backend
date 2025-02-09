import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const templatesCodesToUpdate: string[] = [
    'error_notifications.payment_notification.failed',
    'error_notifications.psp-api.failed',
    'error_notifications.payment-option-credentials.invalid',
    'error_notifications.api-keys.invalid',
  ];
  const templatesToUpdate: EmailTemplatesType[] = emailTemplates.filter(
    (item: EmailTemplatesType) => templatesCodesToUpdate.includes(item.template_name),
  );
  for (const template of templatesToUpdate) {
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
