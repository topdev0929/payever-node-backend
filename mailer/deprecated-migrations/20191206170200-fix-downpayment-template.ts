import { emailTemplates, EmailTemplatesType } from '../fixtures/email-templates';

export async function up(db: any): Promise<void> {
  const downPaymentTemplate: EmailTemplatesType =
    emailTemplates.find((template: EmailTemplatesType) => {
      return template.template_name === 'santander_invoice_downpayment_customer';
    });

  if (downPaymentTemplate) {
    await db._run('update', 'email_templates', {
      query: { _id: downPaymentTemplate._id },
      update: { $set: downPaymentTemplate },
    });
  }

  return null;
}

export function down(): void {
  return null;
}
